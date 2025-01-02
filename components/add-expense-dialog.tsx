'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Member {
  user_id: string;
  profiles: {
    id: string;
    name: string;
  }[];
}

export default function AddExpenseDialog({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data: memberData, error } = await supabase
          .from('group_members')
          .select(`
            user_id,
            profiles (
              id,
              name
            )
          `)
          .eq('group_id', groupId);

        if (error) throw error;

        if (memberData) {
          setMembers(memberData as Member[]);
          if (!paidBy && memberData.length > 0) {
            setPaidBy(memberData[0].user_id);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMembers();
  }, [groupId, paidBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .insert([
          {
            description,
            amount: parseFloat(amount),
            group_id: groupId,
            paid_by: paidBy,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (expenseError) throw expenseError;

      const splits = members.map(member => ({
        expense_id: expenseData.id,
        user_id: member.user_id,
        amount: parseFloat(amount) / members.length
      }));

      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(splits);

      if (splitsError) throw splitsError;

      toast({
        description: "Expense added successfully!",
      });
      setOpen(false);
      setDescription('');
      setAmount('');
      setPaidBy('');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        description: "Failed to add expense",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy} required>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {member.profiles[0]?.name || 'Unnamed User'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}