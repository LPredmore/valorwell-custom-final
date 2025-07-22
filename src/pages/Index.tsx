import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Video, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">
              Healthcare Management Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your practice with our comprehensive telehealth and practice management solution
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-8 w-8 mx-auto text-primary" />
                <CardTitle className="text-lg">Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Schedule and manage appointments with ease
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Video className="h-8 w-8 mx-auto text-primary" />
                <CardTitle className="text-lg">Telehealth</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure video consultations with your patients
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-8 w-8 mx-auto text-primary" />
                <CardTitle className="text-lg">Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive patient records and history
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 mx-auto text-primary" />
                <CardTitle className="text-lg">Secure & HIPAA Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enterprise-grade security for healthcare data
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
