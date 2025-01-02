'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Users, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Group {
  id: string;
  name: string;
  description: string;
}

export default function GroupList({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          description
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching groups:', error);
        return;
      }

      setGroups(data || []);
      setLoading(false);
    };

    fetchGroups();
  }, [userId]);

  const copyGroupId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      description: 'Group ID copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">No Groups Yet</h3>
        <p className="text-sm text-muted-foreground">
          Create a new group or join an existing one to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.id} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {group.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyGroupId(group.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/groups/${group.id}`)}
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}