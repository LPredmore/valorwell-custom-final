import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Signup: React.FC = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📝 FORM INPUT CHANGE:', e.target.name, '=', e.target.value);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    console.log('🔵 SIGN IN - Form submission started');
    e.preventDefault();
    setIsSubmitting(true);
    console.log('📧 Sign in email:', formData.email);
    console.log('🔒 Sign in password length:', formData.password?.length);
    await signIn(formData.email, formData.password);
    setIsSubmitting(false);
    console.log('🏁 SIGN IN - Process completed');
  };

  const handleClientSignup = async (e: React.FormEvent) => {
    console.log('🟢 CLIENT SIGNUP - Form submission started');
    e.preventDefault();
    
    console.log('📝 CLIENT SIGNUP Form data:');
    console.log('Email:', formData.email);
    console.log('Password length:', formData.password?.length);
    console.log('Confirm password length:', formData.confirmPassword?.length);
    console.log('First name:', formData.firstName);
    console.log('Last name:', formData.lastName);
    console.log('Passwords match:', formData.password === formData.confirmPassword);
    
    if (formData.password !== formData.confirmPassword) {
      console.error('❌ CLIENT SIGNUP - Password mismatch, aborting');
      return;
    }
    
    setIsSubmitting(true);
    console.log('✅ CLIENT SIGNUP - Password validation passed, calling signUp...');
    console.log('🎯 CLIENT SIGNUP - Calling signUp with role: client');
    
    await signUp(formData.email, formData.firstName, formData.lastName, '', '', '');
    
    setIsSubmitting(false);
    console.log('🏁 CLIENT SIGNUP - Process completed');
  };

  const handleStaffSignup = async (e: React.FormEvent) => {
    console.log('🟡 STAFF SIGNUP - Form submission started');
    e.preventDefault();
    
    console.log('📝 STAFF SIGNUP Form data:');
    console.log('Email:', formData.email);
    console.log('Password length:', formData.password?.length);
    console.log('Confirm password length:', formData.confirmPassword?.length);
    console.log('First name:', formData.firstName);
    console.log('Last name:', formData.lastName);
    console.log('Passwords match:', formData.password === formData.confirmPassword);
    
    if (formData.password !== formData.confirmPassword) {
      console.error('❌ STAFF SIGNUP - Password mismatch, aborting');
      return;
    }
    
    setIsSubmitting(true);
    console.log('✅ STAFF SIGNUP - Password validation passed, calling signUp...');
    console.log('🎯 STAFF SIGNUP - Calling signUp with role: clinician');
    
    await signUp(formData.email, formData.firstName, formData.lastName, '', '', '');
    
    setIsSubmitting(false);
    console.log('🏁 STAFF SIGNUP - Process completed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground">Sign in or create your account</p>
          </div>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="client">Client Signup</TabsTrigger>
            <TabsTrigger value="staff">Staff Signup</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Sign in to your existing account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client">
            <Card>
              <CardHeader>
                <CardTitle>Client Registration</CardTitle>
                <CardDescription>
                  Create your client account to schedule appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleClientSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-firstname">First Name</Label>
                      <Input
                        id="client-firstname"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-lastname">Last Name</Label>
                      <Input
                        id="client-lastname"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Password</Label>
                    <Input
                      id="client-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-confirm-password">Confirm Password</Label>
                    <Input
                      id="client-confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || formData.password !== formData.confirmPassword}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Client Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Registration</CardTitle>
                <CardDescription>
                  Create your clinician/staff account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStaffSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff-firstname">First Name</Label>
                      <Input
                        id="staff-firstname"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-lastname">Last Name</Label>
                      <Input
                        id="staff-lastname"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input
                      id="staff-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <Input
                      id="staff-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-confirm-password">Confirm Password</Label>
                    <Input
                      id="staff-confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || formData.password !== formData.confirmPassword}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Staff Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};