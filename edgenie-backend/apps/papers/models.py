import uuid
from django.db import models
from django.contrib.postgres.search import SearchVectorField
from django.contrib.postgres.indexes import GinIndex
from cloudinary.models import CloudinaryField


class Subject(models.Model):
    BOARDS  = [('CAIE','CAIE'),('EDEXCEL','Edexcel')]
    LEVELS  = [('O_LEVEL','O Level'),('A_LEVEL','A Level'),
               ('IGCSE','IGCSE')]

    id        = models.UUIDField(primary_key=True,
                    default=uuid.uuid4, editable=False)
    name      = models.CharField(max_length=100)
    # Paper code e.g. 5054, 2281, 4024, 5090
    code      = models.CharField(max_length=20, unique=True)
    board     = models.CharField(max_length=20, choices=BOARDS,
                    default='CAIE')
    level     = models.CharField(max_length=20, choices=LEVELS,
                    default='O_LEVEL')
    icon_url  = models.URLField(blank=True)
    color_hex = models.CharField(max_length=7, default='#4F8EF7')
    is_active = models.BooleanField(default=True)
    created_at= models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'subjects'
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.code})'


class Topic(models.Model):
    id           = models.UUIDField(primary_key=True,
                       default=uuid.uuid4, editable=False)
    subject      = models.ForeignKey(Subject,
                       on_delete=models.CASCADE,
                       related_name='topics')
    name         = models.CharField(max_length=255)
    unit         = models.CharField(max_length=100, blank=True)
    parent_topic = models.ForeignKey(
                       'self', on_delete=models.SET_NULL,
                       null=True, blank=True,
                       related_name='subtopics')
    order        = models.IntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'topics'
        ordering = ['order', 'name']
        unique_together = ['subject', 'name']

    def __str__(self):
        return f'{self.subject.name} — {self.name}'


class Paper(models.Model):
    SESSIONS = [
        ('May/June','May/June'),
        ('Oct/Nov','Oct/Nov'),
        ('Feb/March','Feb/March'),
    ]
    id           = models.UUIDField(primary_key=True,
                       default=uuid.uuid4, editable=False)
    subject      = models.ForeignKey(Subject,
                       on_delete=models.CASCADE,
                       related_name='papers')
    year         = models.IntegerField()
    session      = models.CharField(max_length=20, choices=SESSIONS)
    paper_number = models.IntegerField(default=1)
    variant      = models.IntegerField(default=1)
    total_marks  = models.IntegerField(default=0)
    pdf_url      = models.URLField(blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'papers'
        ordering = ['-year', 'session']
        unique_together = [
            'subject','year','session','paper_number','variant'
        ]

    def __str__(self):
        return (f'{self.subject.code} '
                f'{self.session} {self.year} '
                f'P{self.paper_number}v{self.variant}')


class Question(models.Model):
    DIFFICULTIES = [
        ('easy','Easy'),('medium','Medium'),('hard','Hard')
    ]
    id                 = models.UUIDField(primary_key=True,
                             default=uuid.uuid4, editable=False)
    paper              = models.ForeignKey(Paper,
                             on_delete=models.CASCADE,
                             related_name='questions')
    topic              = models.ForeignKey(Topic,
                             on_delete=models.SET_NULL,
                             null=True, blank=True,
                             related_name='questions')
    question_number    = models.CharField(max_length=20)
    raw_question_number= models.CharField(max_length=100, blank=True)
    text               = models.TextField(blank=True)
    unit               = models.CharField(max_length=200, blank=True)
    marks              = models.IntegerField(default=1)
    difficulty         = models.CharField(max_length=10,
                             choices=DIFFICULTIES, default='medium')
    has_image          = models.BooleanField(default=False)
    image_url          = CloudinaryField('q_images',
                             blank=True, null=True)
    has_parts          = models.BooleanField(default=False)
    marking_scheme     = models.TextField(blank=True)
    sub_topics         = models.JSONField(default=list, blank=True)
    tags               = models.JSONField(default=list, blank=True)
    ai_confidence      = models.FloatField(null=True, blank=True)
    search_vector      = SearchVectorField(null=True, blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'questions'
        ordering = ['paper', 'question_number']
        indexes = [
            GinIndex(fields=['search_vector'],
                     name='question_search_gin'),
            models.Index(fields=['topic','difficulty'],
                         name='q_topic_diff'),
        ]

    def __str__(self):
        return f'Q{self.question_number} — {self.paper}'

    def get_full_text(self):
        parts = ' '.join(
            f'({p.part_label}) {p.part_text}'
            for p in self.question_parts.all()
        )
        topic = self.topic.name if self.topic else ''
        subs  = ' '.join(self.sub_topics or [])
        return f'{topic}. {subs}. {self.text} {parts}'.strip()


class QuestionPart(models.Model):
    id             = models.UUIDField(primary_key=True,
                         default=uuid.uuid4, editable=False)
    question       = models.ForeignKey(Question,
                         on_delete=models.CASCADE,
                         related_name='question_parts')
    part_label     = models.CharField(max_length=10)
    part_text      = models.TextField(blank=True)
    has_image      = models.BooleanField(default=False)
    image_url      = CloudinaryField('part_images',
                         blank=True, null=True)
    marking_answer = models.TextField(blank=True)
    marks          = models.IntegerField(default=1)
    order          = models.IntegerField(default=0)

    class Meta:
        db_table = 'question_parts'
        ordering = ['order', 'part_label']
        unique_together = ['question', 'part_label']
