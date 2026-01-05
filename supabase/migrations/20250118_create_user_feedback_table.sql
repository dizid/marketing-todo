-- Create user_feedback table for collecting task ratings and testimonials
-- Used to gather feedback after AI task completion and collect testimonials

CREATE TABLE IF NOT EXISTS public.user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  task_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  can_use_as_testimonial BOOLEAN DEFAULT FALSE,
  testimonial_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX idx_user_feedback_rating ON public.user_feedback(rating);
CREATE INDEX idx_user_feedback_testimonial ON public.user_feedback(can_use_as_testimonial);
CREATE INDEX idx_user_feedback_created_at ON public.user_feedback(created_at DESC);

-- RLS policies
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON public.user_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own feedback
CREATE POLICY "Users can read own feedback" ON public.user_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Users cannot update or delete feedback (immutable for integrity)
-- Admin access would be handled through a separate admin role

-- Comment on table
COMMENT ON TABLE public.user_feedback IS 'Stores user feedback and ratings for AI tasks, including potential testimonials';
COMMENT ON COLUMN public.user_feedback.rating IS 'Rating from 1 (poor) to 5 (excellent)';
COMMENT ON COLUMN public.user_feedback.can_use_as_testimonial IS 'User has consented to using feedback as testimonial';
COMMENT ON COLUMN public.user_feedback.testimonial_approved IS 'Admin has approved testimonial for public display';
