'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Expense {
  id: string;
  description: string;
  amount: number;
  created_at: string;
  paid_by: string;
  paid_by_user: {
    name: string;
  };
}

export default function ExpenseList({ groupId }: { groupId: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          paid_by_user:profiles!paid_by(name)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      setExpenses(data);
      setLoading(false);
    };

    fetchExpenses();

    // Subscribe to new expenses
    const channel = supabase
      .channel('expenses')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expenses',
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          setExpenses((current) => [payload.new as Expense, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  if (loading) return null;

  if (expenses.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No expenses yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{expense.description}</h3>
              <p className="text-sm text-muted-foreground">
                Paid by {expense.paid_by_user.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                ₹{expense.amount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(expense.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}