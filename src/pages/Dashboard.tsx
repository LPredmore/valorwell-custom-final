
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Video, FileText, Clock, AlertCircle, Plus } from 'lucide-react';
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
      client: `${apt.clients.client_first_name} ${apt.clients.client_last_name}`,
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your practice today.
          </p>
        </div>
        <Button asChild>
          <Link to="/appointments/new">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Appointments
            </CardTitle>
            <CardDescription>
              Your schedule for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{appointment.client}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{appointment.time}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'scheduled'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'documented'
                            ? 'bg-blue-100 text-blue-800'
                            : appointment.status === 'no show'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled for today</p>
                  <Button asChild className="mt-4">
                    <Link to="/appointments/new">Schedule Appointment</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <AlertCircle
                    className={`h-4 w-4 mt-0.5 ${
                      alert.type === 'warning'
                        ? 'text-orange-500'
                        : 'text-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
