import factory
from django.contrib.auth import get_user_model
from apps.papers.models import Subject, Topic, Paper, Question
from apps.submissions.models import Submission
from apps.scraper.models import ScraperJob

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    email     = factory.Sequence(lambda n: f'user{n}@test.com')
    full_name = factory.Faker('name')
    password  = factory.PostGenerationMethodCall(
        'set_password', 'TestPass123!'
    )
    role      = 'student'
    is_verified = True

class AdminFactory(UserFactory):
    role     = 'admin'
    is_staff = True

class SubjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Subject
    name      = factory.Sequence(lambda n: f'Subject {n}')
    code      = factory.Sequence(lambda n: f'400{n}')
    board     = 'CAIE'
    level     = 'O_LEVEL'
    color_hex = '#4F8EF7'

class TopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Topic
    subject = factory.SubFactory(SubjectFactory)
    name    = factory.Sequence(lambda n: f'Topic {n}')
    unit    = 'Unit 1'

class PaperFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Paper
    subject      = factory.SubFactory(SubjectFactory)
    year         = 2020
    session      = 'May/June'
    paper_number = 1
    variant      = 1
    total_marks  = 80

class QuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Question
    paper           = factory.SubFactory(PaperFactory)
    topic           = factory.SubFactory(
                          TopicFactory,
                          subject=factory.SelfAttribute('..paper.subject')
                      )
    question_number = factory.Sequence(lambda n: str(n))
    text            = factory.Faker('sentence', nb_words=15)
    marks           = 4
    difficulty      = 'medium'
    marking_scheme  = 'Award 1 mark for each correct point.'

class ScraperJobFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ScraperJob
    # Not using initiated_by as of our model which doesn't have it explicitly right now, let's keep or remove if it fails.
    # initiated_by = factory.SubFactory(AdminFactory)
    subject_code = '5090'
    year         = '2020'
    session      = 'may-june'
    paper_type   = 'qp'
    variant      = '11'
    status       = 'queued'
