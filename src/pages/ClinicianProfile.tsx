import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export const ClinicianProfile: React.FC = () => {
  const { data: profile } = useProfile();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8 bg-card rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-lg font-semibold">
              TT
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">
                Test Therapist
              </h1>
            </div>
            <p className="text-muted-foreground mb-3">NotReal Therapist, LPC</p>
            <div className="flex gap-2">
              <Badge variant="default" className="bg-blue-500 text-white">Active</Badge>
              <Badge variant="secondary">Mental Health</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">Test</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">Therapist</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Professional Name</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">NotReal Therapist, LPC</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{profile?.email || 'test@example.com'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">(555) 123-4567</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Bio</label>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-foreground">Licensed Professional Counselor specializing in mental health therapy with over 10 years of experience helping individuals overcome anxiety, depression, and relationship challenges.</p>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Clinical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">NPI Number</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">1234567890</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">License Type</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">LPC - Licensed Professional Counselor</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Licensed States</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">TX, CA, NY</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Taxonomy Code</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">101YP2500X</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Accepting New Clients</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">Yes</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Minimum Client Age</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">18 years</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};