
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AdminUserCreator: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔵 ADMIN USER CREATOR - Form submitted with data:', formData);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: formData
      });

      console.log('📊 Edge function response:', { data, error });

      if (error) {
        console.error('❌ Edge function error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to create user: ${error.message}`,
        });
        return;
      }

      if (data.error) {
        console.error('❌ Server error:', data.error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to create user: ${data.error}`,
        });
        return;
      }

      console.log('✅ User created successfully:', data);
      toast({
        title: 'Success',
        description: 'Admin user created successfully!',
      });

      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'admin'
      });

    } catch (error) {
      console.error('💥 Unexpected error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Pre-fill with the requested user data
  const fillLucasData = () => {
    setFormData({
      email: 'info@valorwell.org',
      password: '$V@l0rW3ll',
      firstName: 'Lucas',
      lastName: 'Predmore',
      phone: '5736946131',
      role: 'admin'
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Admin User</CardTitle>
        <CardDescription>Create a new user with admin privileges</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="clinician">Clinician</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create User'}
            </Button>
            <Button type="button" variant="outline" onClick={fillLucasData}>
              Fill Lucas Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
