
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    email: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No profile found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Email cannot be changed here. Please contact support if needed.
              </p>
            </div>
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Personal information like name and phone are managed in your role-specific profile.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
