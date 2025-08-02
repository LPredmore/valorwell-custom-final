import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Shield, User, UserCheck } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Client Portal</h1>
          <p className="text-muted-foreground">Manage your appointments and profile information</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Profile
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Insurance
            </TabsTrigger>
            <TabsTrigger value="therapist" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Therapist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Your scheduled sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button variant="outline" className="mt-2">
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Documents
                  </CardTitle>
                  <CardDescription>Your latest forms and reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No documents available</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance Status
                  </CardTitle>
                  <CardDescription>Your insurance information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">Pending Verification</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Profile management coming soon.</p>
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>View and manage your documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Document management coming soon.</p>
                <Button variant="outline">Upload Document</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>Manage your insurance details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Insurance management coming soon.</p>
                <Button variant="outline">Update Insurance</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="therapist" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Therapist</CardTitle>
                <CardDescription>Connect with your assigned therapist</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Therapist information coming soon.</p>
                <Button variant="outline">Contact Therapist</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}