from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import StudentProfile, Achievement

User = get_user_model()


class SubjectMiniSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    code = serializers.CharField()
    color_hex = serializers.CharField()


class StudentProfileSerializer(serializers.ModelSerializer):
    subjects = SubjectMiniSerializer(many=True, read_only=True)
    subject_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )
    accuracy = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            'subjects', 'subject_ids', 'target_grade', 'weak_topics',
            'total_practice_time', 'streak_days', 'last_active',
            'onboarding_complete', 'accuracy'
        ]

    def get_accuracy(self, obj):
        return obj.get_overall_accuracy()


class UserSerializer(serializers.ModelSerializer):
    studentprofile = StudentProfileSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'role', 'plan', 'is_verified',
            'date_joined', 'avatar_url', 'studentprofile'
        ]

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid login credentials.', code='authorization')
        else:
            raise serializers.ValidationError('Must include "email" and "password".', code='authorization')

        attrs['user'] = user
        return attrs


class UpdateProfileSerializer(serializers.ModelSerializer):
    subject_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )
    full_name = serializers.CharField(required=False)
    target_grade = serializers.CharField(source='studentprofile.target_grade', required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['full_name', 'subject_ids', 'target_grade', 'avatar']

    def update(self, instance, validated_data):
        if 'full_name' in validated_data:
            instance.full_name = validated_data['full_name']
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
        instance.save()
        
        profile = getattr(instance, 'studentprofile', None)
        if profile:
            profile_data = validated_data.get('studentprofile', {})
            if 'target_grade' in profile_data:
                profile.target_grade = profile_data['target_grade']
            if 'subject_ids' in validated_data:
                from apps.papers.models import Subject
                subjects = Subject.objects.filter(id__in=validated_data['subject_ids'])
                profile.subjects.set(subjects)
                profile.onboarding_complete = True
            profile.save()
            
        return instance


class UserStatsSerializer(serializers.Serializer):
    total_questions_practiced = serializers.IntegerField()
    overall_accuracy = serializers.FloatField()
    streak_days = serializers.IntegerField()
    topics_covered_count = serializers.IntegerField()
    total_practice_time_minutes = serializers.IntegerField()
    has_perfect_score = serializers.BooleanField()
