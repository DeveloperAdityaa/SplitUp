import { toast } from "sonner";

export function useToast() {
  return {
    toast: ({ title, description, variant }: { 
      title?: string;
      description: string;
      variant?: 'default' | 'destructive';
    }) => {
      toast(title || description, {
        description: title ? description : undefined,
        style: variant === 'destructive' ? { backgroundColor: 'red' } : undefined
      });
    }
  };
} 