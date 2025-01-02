'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';

interface Balance {
  user_id: string;
  name: string;
  balance: number;
}

export default function BalanceOverview({ groupId }: { groupId: string }) {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateBalances = async () => {
      // Get all expenses and splits for the group
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          amount,
          paid_by,
          expense_splits (
            user_id,
            amount
          )
        `)
        .eq('group_id', groupId);

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
        return;
      }

      // Get all members
      const { data: members, error: membersError } = await supabase
        .from('group_members')
        .select(`
          user_id,
          profiles (
            name
          )
        `)
        .eq('group_id', groupId);

      if (membersError) {
        console.error('Error fetching members:', membersError);
        return;
      }

      // Calculate balances
      const balanceMap = new Map<string, number>();
      members.forEach((member) => {
        balanceMap.set(member.user_id, 0);
      });

      expenses.forEach((expense) => {
        // Add the full amount to the payer's balance
        balanceMap.set(
          expense.paid_by,
          (balanceMap.get(expense.paid_by) || 0) + expense.amount
        );

        // Subtract each person's share
        expense.expense_splits.forEach((split) => {
          balanceMap.set(
            split.user_id,
            (balanceMap.get(split.user_id) || 0) - split.amount
          );
        });
      });

      // Convert to array with names
      const balanceArray = members.map((member) => ({
        user_id: member.user_id,
        name: member.profiles.name,
        balance: balanceMap.get(member.user_id) || 0,
      }));

      setBalances(balanceArray);
      setLoading(false);
    };

    calculateBalances();
  }, [groupId]);

  if (loading) return null;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Balances</h2>
      <div className="space-y-2">
        {balances.map((balance) => (
          <div
            key={balance.user_id}
            className="flex justify-between items-center"
          >
            <span className="text-sm">{balance.name}</span>
            <span
              className={`text-sm font-medium ${
                balance.balance > 0
                  ? 'text-green-600'
                  : balance.balance < 0
                  ? 'text-red-600'
                  : ''
              }`}
            >
              ${balance.balance.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}