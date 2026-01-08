import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication, JobApplicationFormData } from '@/types/job-application';
import { toast } from 'sonner';

export const useJobApplications = () => {
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as JobApplication[];
    },
  });

  const addApplication = useMutation({
    mutationFn: async (formData: JobApplicationFormData) => {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Application added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add application: ' + error.message);
    },
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, ...formData }: JobApplicationFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('job_applications')
        .update(formData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Application updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update application: ' + error.message);
    },
  });

  const deleteApplication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Application deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete application: ' + error.message);
    },
  });

  return {
    applications,
    isLoading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
  };
};
