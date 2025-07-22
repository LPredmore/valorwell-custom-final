import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building, Users, CreditCard, FileText, Shield } from 'lucide-react';

const Settings = () => {
  const [practiceData, setPracticeData] = useState({
    practice_name: '',
    tax_id: '',
    practice_npi: '',
    group_taxonomy: '',
    address: '',
    address_2: '',
    city: '',
    state: '',
    zip_code: '',
  });

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Practice data:', practiceData);
  };

  const handlePracticeChange = (field: string, value: string) => {
    setPracticeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your practice settings and configuration</p>
      </div>

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePracticeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="practice_name">Practice Name</Label>
                    <Input
                      id="practice_name"
                      value={practiceData.practice_name}
                      onChange={(e) => handlePracticeChange('practice_name', e.target.value)}
                      placeholder="Enter practice name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax_id">Tax ID</Label>
                    <Input
                      id="tax_id"
                      value={practiceData.tax_id}
                      onChange={(e) => handlePracticeChange('tax_id', e.target.value)}
                      placeholder="Enter tax ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="practice_npi">Practice NPI Number</Label>
                    <Input
                      id="practice_npi"
                      value={practiceData.practice_npi}
                      onChange={(e) => handlePracticeChange('practice_npi', e.target.value)}
                      placeholder="Enter NPI number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group_taxonomy">Group Taxonomy</Label>
                    <Input
                      id="group_taxonomy"
                      value={practiceData.group_taxonomy}
                      onChange={(e) => handlePracticeChange('group_taxonomy', e.target.value)}
                      placeholder="Enter group taxonomy"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Practice Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={practiceData.address}
                        onChange={(e) => handlePracticeChange('address', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address_2">Address 2</Label>
                      <Input
                        id="address_2"
                        value={practiceData.address_2}
                        onChange={(e) => handlePracticeChange('address_2', e.target.value)}
                        placeholder="Enter apartment, suite, etc. (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={practiceData.city}
                        onChange={(e) => handlePracticeChange('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={practiceData.state}
                        onChange={(e) => handlePracticeChange('state', e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code">Zip Code</Label>
                      <Input
                        id="zip_code"
                        value={practiceData.zip_code}
                        onChange={(e) => handlePracticeChange('zip_code', e.target.value)}
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Practice Information</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Billing configuration features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Documentation configuration features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security configuration features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;