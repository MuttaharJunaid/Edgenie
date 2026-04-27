from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Submission, MockExam, MockExamAnswer
from .serializers import (
    SubmissionSerializer, MockExamCreateSerializer,
    MockExamSerializer, MockExamAnswerSerializer
)
from apps.papers.models import Question, Subject
from .tasks import grade_submission, grade_exam_answer, generate_exam_feedback
import random

class SubmissionListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/submissions/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubmissionSerializer

    def get_queryset(self):
        qs = Submission.objects.filter(student=self.request.user).order_by('-submitted_at')
        if 'question' in self.request.query_params:
            qs = qs.filter(question_id=self.request.query_params['question'])
        return qs

    def perform_create(self, serializer):
        submission = serializer.save(student=self.request.user)
        grade_submission.delay(str(submission.id))


class SubmissionDetailView(generics.RetrieveAPIView):
    """GET /api/submissions/<id>/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubmissionSerializer

    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user)


class MockExamListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/mock-exams/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MockExamSerializer

    def get_queryset(self):
        return MockExam.objects.filter(student=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = MockExamCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        subject_id = data['subject']
        topics = data['topics']
        difficulty = data['difficulty']
        q_count = data['question_count']

        qs = Question.objects.filter(paper__subject__id=subject_id).distinct()
        
        if topics:
            qs = qs.filter(topic__id__in=topics)
        if difficulty != 'mixed':
            qs = qs.filter(difficulty=difficulty)

        # Basic random sampling fallback
        all_qs = list(qs)
        if len(all_qs) < q_count:
            # Fall back to subject level ignore difficulty
            all_qs = list(Question.objects.filter(paper__subject__id=subject_id).distinct())

        selected_qs = random.sample(all_qs, min(q_count, len(all_qs)))
        if not selected_qs:
            return Response({'error': 'No questions found.'}, status=status.HTTP_400_BAD_REQUEST)

        # Convert UUIDs to str for JSON serialization
        config_data = {
            'subject': str(subject_id),
            'duration_minutes': data['duration_minutes'],
            'difficulty': difficulty,
            'question_count': q_count,
            'topics': [str(t) for t in topics],
            'focus_weak_topics': data.get('focus_weak_topics', False),
        }

        exam = MockExam.objects.create(
            student=request.user,
            subject=Subject.objects.get(id=subject_id),
            duration_minutes=data['duration_minutes'],
            config=config_data,
            total_marks=sum(q.marks for q in selected_qs)
        )
        exam.questions.set(selected_qs)

        return Response(MockExamSerializer(exam).data, status=status.HTTP_201_CREATED)


class MockExamDetailView(generics.RetrieveAPIView):
    """GET /api/mock-exams/<id>/"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MockExamSerializer

    def get_queryset(self):
        return MockExam.objects.filter(student=self.request.user)


class MockExamSubmitView(APIView):
    """POST /api/mock-exams/<id>/submit/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            exam = MockExam.objects.get(id=pk, student=request.user)
        except MockExam.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if exam.status == 'completed':
            return Response(MockExamSerializer(exam).data)

        # Calculate obtained marks
        answers = MockExamAnswer.objects.filter(exam=exam).select_related('question__topic')
        total_obtained = 0
        topic_bd = {}
        q_results = []

        for ans in answers:
            marks = ans.marks_obtained or 0
            total_obtained += marks
            
            topic_name = ans.question.topic.name if ans.question.topic else 'General'
            if topic_name not in topic_bd:
                topic_bd[topic_name] = {'possible': 0, 'obtained': 0}
            topic_bd[topic_name]['possible'] += ans.question.marks
            topic_bd[topic_name]['obtained'] += marks
            
            q_results.append({
                'question_id': str(ans.question.id),
                'marks': marks,
                'max_marks': ans.question.marks,
                'is_correct': marks > 0
            })

        exam.status = 'completed'
        exam.completed_at = timezone.now()
        exam.obtained_marks = total_obtained
        exam.topic_breakdown = topic_bd
        exam.question_results = q_results
        exam.save()

        generate_exam_feedback.delay(str(exam.id))
        
        return Response(MockExamSerializer(exam).data)

class MockExamAnswerView(APIView):
    """POST /api/mock-exams/<id>/answers/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            exam = MockExam.objects.get(id=pk, student=request.user)
        except MockExam.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = MockExamAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if exam.status == 'pending':
            exam.status = 'ongoing'
            exam.started_at = timezone.now()
            exam.save()

        q_id = serializer.validated_data['question'].id
        ans_text = serializer.validated_data.get('answer_text', '')
        ans_img = serializer.validated_data.get('answer_image')

        answer, _ = MockExamAnswer.objects.update_or_create(
            exam=exam, question_id=q_id,
            defaults={'answer_text': ans_text, 'answer_image': ans_img}
        )

        grade_exam_answer.delay(str(answer.id))
        return Response(MockExamAnswerSerializer(answer).data, status=status.HTTP_201_CREATED)


class SessionFeedbackView(APIView):
    """POST /api/feedback/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from .models import SessionFeedback
        data = request.data
        SessionFeedback.objects.create(
            user=request.user,
            session_type=data.get('session_type', 'general'),
            rating=int(data.get('rating', 5)),
            comment=data.get('comment', '')[:1000]
        )
        return Response({'message': 'Feedback received.'}, status=status.HTTP_201_CREATED)
