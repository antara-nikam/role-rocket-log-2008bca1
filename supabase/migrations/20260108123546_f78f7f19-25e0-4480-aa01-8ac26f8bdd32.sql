-- Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email text,
  display_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add user_id and follow_up_date to job_applications
ALTER TABLE public.job_applications 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN follow_up_date date;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all delete access" ON public.job_applications;
DROP POLICY IF EXISTS "Allow all insert access" ON public.job_applications;
DROP POLICY IF EXISTS "Allow all read access" ON public.job_applications;
DROP POLICY IF EXISTS "Allow all update access" ON public.job_applications;

-- Create user-specific RLS policies
CREATE POLICY "Users can view their own applications"
ON public.job_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications"
ON public.job_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON public.job_applications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
ON public.job_applications FOR DELETE
USING (auth.uid() = user_id);