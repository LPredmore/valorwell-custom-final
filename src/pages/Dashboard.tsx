
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Video, FileText, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '8',
      description: '+2 from yesterday',
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
      value: '3',
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

  const upcomingAppointments = [
    {
      id: 1,
      client: 'Sarah Johnson',
      time: '10:00 AM',
      type: 'Initial Consultation',
      status: 'confirmed',
    },
    {
      id: 2,
      client: 'Michael Chen',
      time: '11:30 AM',
      type: 'Follow-up',
      status: 'confirmed',
    },
    {
      id: 3,
      client: 'Emily Rodriguez',
      time: '2:00 PM',
      type: 'Telehealth Session',
      status: 'pending',
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your practice today.
        </p>
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
              {upcomingAppointments.map((appointment) => (
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
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
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
