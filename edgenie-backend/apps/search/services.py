"""
Search service — Gemini-powered + FTS fallback.
AI logic (query understanding) imported from ai/search module.
DB querying and scoring remain here as they are Django-specific.
"""
import json
import logging
from django.conf import settings
from apps.papers.models import Question

from ai.search.gemini_search import understand_query

logger = logging.getLogger('edgenie')


class GeminiSearchService:
    def search(self, query, filters, page=1, page_size=20):
        if settings.GEMINI_API_KEY and query.strip():
            try:
                return self._gemini_search(
                    query, filters, page, page_size
                )
            except Exception as e:
                logger.warning(f'Gemini search fell back: {e}')
        return self._fts_search(query, filters, page, page_size)

    def _gemini_search(self, query, filters, page, page_size):
        # Step 1: understand query intent via ai/search module
        understood = understand_query(query)

        # Step 2: build DB queryset
        qs = Question.objects.select_related(
            'topic', 'paper', 'paper__subject'
        ).prefetch_related('question_parts')

        qs = self._apply_filters(qs, filters)

        # Apply Gemini-understood intent
        if understood.get('subject') and not filters.get('subject_id'):
            qs = qs.filter(
                paper__subject__name__icontains=understood['subject']
            )
        if understood.get('difficulty') and not filters.get('difficulty'):
            qs = qs.filter(difficulty=understood['difficulty'])
        if understood.get('year_from') and not filters.get('year_from'):
            qs = qs.filter(paper__year__gte=understood['year_from'])
        if understood.get('year_to') and not filters.get('year_to'):
            qs = qs.filter(paper__year__lte=understood['year_to'])

        # Keyword + topic filtering
        kws = (understood.get('topics', [])
               + understood.get('keywords', []))[:5]
        if kws:
            from django.db.models import Q
            f = Q()
            for kw in kws:
                if len(kw) > 2:
                    f |= (Q(topic__name__icontains=kw)
                          | Q(text__icontains=kw))
            qs = qs.filter(f)

        questions = list(qs.distinct()[:100])

        # Step 3: score + sort
        scored = self._score(questions, query, understood)
        scored.sort(key=lambda x: x[1], reverse=True)

        start = (page - 1) * page_size
        page_qs = [q for q, _ in scored[start:start + page_size]]
        smap = {str(q.id): s for q, s in scored}
        for q in page_qs:
            q._relevance_score = round(smap.get(str(q.id), 0), 2)

        return {
            'results': page_qs,
            'count': len(scored),
            'has_next': (start + page_size) < len(scored),
            'query_understood': understood.get('query_summary', query),
        }

    def _score(self, questions, query, understood):
        kws = set(
            query.lower().split()
            + understood.get('keywords', [])
            + understood.get('topics', [])
        )
        kws = {k for k in kws if len(k) > 2}
        scored = []
        for q in questions:
            s = 0.0
            t = q.topic.name.lower() if q.topic else ''
            x = q.text.lower()
            for kw in kws:
                if kw in t:
                    s += 0.4
                if kw in x:
                    s += 0.1
            if q.paper.year >= 2018:
                s += 0.05
            scored.append((q, min(s, 1.0)))
        return scored

    def _fts_search(self, query, filters, page, page_size):
        from django.contrib.postgres.search import (
            SearchQuery, SearchRank
        )
        from django.core.paginator import Paginator
        from django.db.models import Q

        qs = Question.objects.select_related(
            'topic', 'paper', 'paper__subject'
        ).prefetch_related('question_parts')
        qs = self._apply_filters(qs, filters)

        if query.strip():
            try:
                sq = SearchQuery(query, search_type='websearch')
                qs = qs.filter(
                    search_vector=sq
                ).annotate(rank=SearchRank('search_vector', sq)
                           ).order_by('-rank')
            except Exception:
                qs = qs.filter(
                    Q(text__icontains=query)
                    | Q(topic__name__icontains=query)
                ).order_by('-paper__year')
        else:
            qs = qs.order_by('-paper__year')

        p = Paginator(qs.distinct(), page_size)
        po = p.get_page(page)
        results = list(po.object_list)
        for q in results:
            q._relevance_score = getattr(q, 'rank', None)
        return {
            'results': results,
            'count': p.count,
            'has_next': po.has_next(),
            'query_understood': query,
        }

    def _apply_filters(self, qs, filters):
        if filters.get('subject_id'):
            qs = qs.filter(
                paper__subject__id=filters['subject_id']
            )
        if filters.get('difficulty'):
            qs = qs.filter(difficulty=filters['difficulty'])
        if filters.get('year_from'):
            qs = qs.filter(paper__year__gte=filters['year_from'])
        if filters.get('year_to'):
            qs = qs.filter(paper__year__lte=filters['year_to'])
        if filters.get('session'):
            qs = qs.filter(paper__session=filters['session'])
        return qs


class JSONFallbackSearchService:
    """Backwards compatibility wrapper."""
    def search(self, query, filters, page=1, page_size=20):
        from ai.search.json_fallback import JSONFallbackSearch
        fb = JSONFallbackSearch()
        results = fb.search(query, subject_code=filters.get('subject_code'))
        start = (page - 1) * page_size
        page_results = results[start:start + page_size]
        return {
            'results': page_results,
            'count': len(results),
            'has_next': (start + page_size) < len(results),
            'query_understood': query,
        }
