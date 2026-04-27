export interface Subject {
  id: string;
  name: string;
  description?: string;
  color_code?: string;
  color_hex?: string;
  icon?: string;
  curriculum?: string;
  board?: string;
  level?: string;
  code?: string;
}

export interface User {
  id: string;
  email: string;
  avatar_url?: string;
  full_name: string;
  stripe_customer_id?: string;
  subscription_tier?: string;
  subscription_status?: string;
  board?: string;
  enrollments?: Array<{ subject: Subject }>;
}

export interface Question {
  id: string;
  content: string;
  text?: string;
  number?: number;
  image_url?: string;
  marks?: number;
  difficulty?: string;
  subject?: string | Subject;
  topic?: { name: string; id: string };
  paper?: {
    year?: number;
    season?: string;
    paper_type?: string;
    time_zone?: number;
    subject?: string | Subject;
    paper_number?: number | string;
  };
  source_paper?: {
    year?: number;
    season?: string;
    paper_type?: string;
    time_zone?: number;
  };
}

export interface AnalyticsStats {
  accuracy?: number;
  global_accuracy_rank?: number | string;
  latency?: string;
  hallucination_rate?: string;
  tokens_per_sec?: string;
  streak_days?: number;
  total_questions_practiced?: number;
  overall_accuracy?: number;
  topics_covered_count?: number;
  best_subject?: string;
  total_practice_time_minutes?: number;
}

export interface AnalyticsData {
  improvement_perc: number;
  total_questions: number;
  total_questions_practiced?: number;
  total_time?: string;
  total_time_minutes?: number;
  accuracy: number;
  overall_accuracy?: number;
  recent_activity: number[];
  streak_days?: number;
  subjects: Array<{
    subject: any;
    accuracy: number;
    completion_percent?: number;
    color_code?: string;
  }>;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  topic_id?: string;
  topic_name?: string;
  subject_name?: string;
  subject_id?: string;
  accuracy?: number;
}

export interface RecentSubmission {
  id: string;
  submitted_at: string;
  question?: string;
  question_detail?: { id: string; content?: string; };
  question_number?: number;
  topic?: string;
  grading_status?: string;
  score_percentage?: number;
}
