import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentCalendar } from '@/features/calendar/components/AppointmentCalendar';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { useAppointments } from '@/features/calendar/hooks/useAppointments';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export const Calendar: React.FC = () => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const { data: appointments = [] } = useAppointments({ 
    start: monthStart, 
    end: monthEnd 
  });

  // Calculate stats for the current month
  const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled').length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(apt => apt.status === 'documented').length;

  const stats = [
    {
      title: 'Total Appointments',
      value: totalAppointments,
      description: `This month (${format(currentDate, 'MMMM yyyy')})`,
      icon: CalendarIcon,
      color: 'text-blue-600',
    },
    {
      title: 'Scheduled',
      value: scheduledAppointments,
      description: 'Upcoming appointments',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      title: 'Completed',
      value: completedAppointments,
      description: 'Documented sessions',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments and availability
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Calendar Component */}
      <div className="space-y-4">
        <AppointmentCalendar />
      </div>
    </div>
  );
};

export default Calendar;