
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Video, FileText, Clock, AlertCircle, Plus, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/features/calendar/hooks/useAppointments';
import { Link } from 'react-router-dom';
import { format, isToday, startOfDay, endOfDay } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const today = new Date();
  
  const { data: appointments = [] } = useAppointments({
    start: startOfDay(today),
    end: endOfDay(today)
  });

  const todayAppointments = appointments.filter(apt => 
    isToday(new Date(apt.start_at))
  );

  const upcomingAppointments = todayAppointments
    .slice(0, 3)
    .map(apt => ({
      id: apt.id,
      client: apt.client_name || 'Unknown Client',
      time: format(new Date(apt.start_at), 'h:mm a'),
      type: apt.type,
      status: apt.status
    }));

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: todayAppointments.length.toString(),
      description: `${todayAppointments.filter(apt => apt.status === 'scheduled').length} scheduled`,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Active Clients',
      value: '127',
      description: '+5 this week',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Telehealth Sessions',
      value: todayAppointments.filter(apt => apt.type === 'telehealth').length.toString(),
      description: 'Scheduled today',
      icon: Video,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Documentation',
      value: '12',
      description: 'Requires attention',
      icon: FileText,
      color: 'text-orange-600',
    },
  ];

  const alerts = [
    {
      id: 1,
      message: 'John Doe missed their appointment yesterday',
      type: 'warning',
      time: '2 hours ago',
    },
    {
      id: 2,
      message: 'New client registration: Maria Garcia',
      type: 'info',
      time: '4 hours ago',
    },
  ];

  return (
    <div className="h-full">
      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-6 p-6 h-full">
        {/* Today's Appointments */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="text-center text-muted-foreground">
                    <p>No appointments scheduled for today.</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No appointments scheduled for today.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Outstanding Documentation */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Outstanding Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-4">
            {/* Sample outstanding documentation items */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Bobby zzzBoucher</span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Jul 16, 2025
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                <Clock className="h-4 w-4 inline mr-1" />
                10:00 AM - 11:00 AM (Chicago (-05:00))
              </div>
              <p className="text-sm mb-3">therapy_session</p>
              <Button className="w-full mb-2">
                <FileText className="h-4 w-4 mr-2" />
                Document Session
              </Button>
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                Session Did Not Occur
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Mr Deeds</span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Jul 16, 2025
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                <Clock className="h-4 w-4 inline mr-1" />
                10:00 AM - 11:00 AM (Chicago (-05:00))
              </div>
              <p className="text-sm mb-3">therapy_session</p>
              <Button className="w-full mb-2">
                <FileText className="h-4 w-4 mr-2" />
                Document Session
              </Button>
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                Session Did Not Occur
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-4">
            {/* Sample upcoming appointments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    10:00 AM - 11:00 AM (Chicago (-05:00))
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Jul 23, 2025
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Bobby zzzBoucher</span>
                  </div>
                  <p className="text-sm text-muted-foreground">therapy_session</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    10:00 AM - 11:00 AM (Chicago (-05:00))
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Jul 30, 2025
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Bobby zzzBoucher</span>
                  </div>
                  <p className="text-sm text-muted-foreground">therapy_session</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    10:00 AM - 11:00 AM (Chicago (-05:00))
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Aug 6, 2025
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Bobby zzzBoucher</span>
                  </div>
                  <p className="text-sm text-muted-foreground">therapy_session</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
