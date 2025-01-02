'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AddExpenseDialog from '@/components/add-expense-dialog';
import  ExpenseList  from '@/components/expense-list';
import  BalanceOverview  from '@/components/balance-overview';

export default function GroupDetails() {
  const params = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data, error } = await supabase
      .from('groups')
      .select(`
        id,
        name,
        description,
        created_at,
        created_by,
        group_members (
          user_id,
          profiles:profiles (
            id,
            name
          )
        )
      `)
      .eq('id', params.id)
      .single();

      if (error) {
        console.error('Error fetching group:', error);
        router.push('/dashboard');
        return;
      }

      setGroup(data);
      setLoading(false);
    };

    fetchGroup();
  }, [params.id, router]);

  if (loading || !group) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{group.name}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Members</h2>
            <div className="space-y-2">
              {group.group_members.map((member: any) => (
                <div key={member.user_id} className="text-sm">
                  {member.profiles.name}
                </div>
              ))}
            </div>
          </Card>

          <BalanceOverview groupId={group.id} />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Expenses</h2>
          <AddExpenseDialog groupId={group.id} />
        </div>

        <ExpenseList groupId={group.id} />
      </div>
    </div>
  );
}