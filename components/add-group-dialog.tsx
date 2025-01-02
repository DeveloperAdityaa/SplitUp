import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface AddGroupDialogProps {
  onGroupAdded: () => void;
}

export default function AddGroupDialog({ onGroupAdded }: AddGroupDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // ... existing group creation code ...

      setOpen(false);
      setName('');
      onGroupAdded(); // Call the callback after successful creation
      
      toast({
        title: 'Success',
        description: 'Group created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ... rest of your dialog JSX ... */}
    </Dialog>
  );
} 