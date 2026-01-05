-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ai_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid,
  task_id character varying NOT NULL,
  model character varying NOT NULL CHECK (model::text = ANY (ARRAY['grok-2'::character varying, 'grok-4-fast'::character varying]::text[])),
  tokens_input integer NOT NULL,
  tokens_output integer NOT NULL,
  cost_estimate numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_usage_pkey PRIMARY KEY (id),
  CONSTRAINT ai_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT ai_usage_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.category_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category_id text NOT NULL,
  notes text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT category_notes_pkey PRIMARY KEY (id),
  CONSTRAINT category_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.exports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  export_type text NOT NULL,
  export_data text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT exports_pkey PRIMARY KEY (id),
  CONSTRAINT exports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.generated_content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_type text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT generated_content_pkey PRIMARY KEY (id),
  CONSTRAINT generated_content_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subscription_id uuid,
  amount numeric NOT NULL,
  currency character varying NOT NULL DEFAULT 'USD'::character varying,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying]::text[])),
  provider character varying NOT NULL DEFAULT 'paypal'::character varying CHECK (provider::text = ANY (ARRAY['paypal'::character varying, 'stripe'::character varying]::text[])),
  provider_payment_id character varying NOT NULL,
  provider_subscription_id character varying,
  payment_type character varying NOT NULL DEFAULT 'subscription'::character varying CHECK (payment_type::text = ANY (ARRAY['subscription'::character varying, 'one_time'::character varying, 'ai_generation'::character varying]::text[])),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT payments_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.project_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  key text NOT NULL,
  value jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  version integer DEFAULT 1,
  last_modified_by uuid,
  last_modified_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_data_pkey PRIMARY KEY (id),
  CONSTRAINT project_data_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT project_data_last_modified_by_fkey FOREIGN KEY (last_modified_by) REFERENCES auth.users(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  tier character varying NOT NULL DEFAULT 'free'::character varying CHECK (tier::text = ANY (ARRAY['free'::character varying, 'premium'::character varying]::text[])),
  status character varying NOT NULL DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'cancelled'::character varying, 'expired'::character varying, 'paused'::character varying]::text[])),
  current_period_start timestamp with time zone NOT NULL DEFAULT now(),
  current_period_end timestamp with time zone NOT NULL DEFAULT (now() + '1 mon'::interval),
  cancelled_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  stripe_customer_id text,
  stripe_subscription_id text,
  payment_provider text DEFAULT 'stripe'::text,
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.task_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id uuid NOT NULL,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT task_progress_pkey PRIMARY KEY (id),
  CONSTRAINT task_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id),
  CONSTRAINT task_progress_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  task_name text NOT NULL,
  description text,
  ai_prompt text,
  has_ai boolean DEFAULT false,
  is_completed boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  app_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  key text NOT NULL,
  value text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);

-- =============================================================================
-- SSOT Phase 4: Normalized Task Storage Tables (Added 2025-01-11)
-- =============================================================================
-- These tables replace the blob storage in project_data.value.taskData
-- Benefits: Field-level queries, no version conflicts, no AI response storage

CREATE TABLE public.task_form_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  task_id text NOT NULL,
  field_name text NOT NULL,
  field_value jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT task_form_data_pkey PRIMARY KEY (id),
  CONSTRAINT task_form_data_unique UNIQUE (project_id, task_id, field_name),
  CONSTRAINT task_form_data_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT task_form_data_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.task_saved_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  task_id text NOT NULL,
  item_data jsonb NOT NULL,
  item_order integer DEFAULT 0,
  saved_at timestamp with time zone DEFAULT now(),
  saved_by uuid,
  CONSTRAINT task_saved_items_pkey PRIMARY KEY (id),
  CONSTRAINT task_saved_items_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT task_saved_items_saved_by_fkey FOREIGN KEY (saved_by) REFERENCES auth.users(id) ON DELETE SET NULL
);