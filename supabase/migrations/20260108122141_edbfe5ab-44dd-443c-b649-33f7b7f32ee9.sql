-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  job_role TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('Internship', 'Full-time')),
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for demo - no auth required)
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (beginner-friendly, no auth needed)
CREATE POLICY "Allow all read access" 
ON public.job_applications 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all insert access" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all update access" 
ON public.job_applications 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow all delete access" 
ON public.job_applications 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();