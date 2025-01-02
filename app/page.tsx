'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Wallet2, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-8">SplitUp</h1>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">SplitShare</h1>
            <p className="text-muted-foreground">
              Split expenses with friends and roommates
            </p>
          </div>
          
          <Card className="p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(var(--primary))',
                      brandAccent: 'rgb(var(--primary-foreground))',
                    },
                  },
                },
              }}
              providers={['google']}
              redirectTo={`${window.location.origin}/dashboard`}
            />
          </Card>

          <div className="space-y-8 mt-12">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Wallet2 className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Track Expenses</h3>
                  <p className="text-sm text-muted-foreground">
                    Easily record shared expenses
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Group Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and join expense groups
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  router.push('/dashboard');
  return null;
}