
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Video, FileText, Clock, AlertCircle, Plus, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/features/calendar/hooks/useAppointments';
import { useProfile } from '@/hooks/useProfile';
import { useClinicians } from '@/hooks/useClinicians';
import { Link } from 'react-router-dom';
import { format, isToday, startOfDay, endOfDay, isBefore, isAfter, startOfTomorrow } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const today = new Date();
  
  // Fetch appointments for a wider range to get past and future appointments
  const { data: allAppointments = [] } = useAppointments();

  // Get current clinician's ID from clinicians table
  const { data: clinicians = [] } = useClinicians();
  const currentClinician = clinicians.find(c => c.profile_id === profile?.id);
  
  // Filter appointments for current clinician only
  const clinicianAppointments = allAppointments.filter(apt => {
    return profile?.role === 'clinician' && apt.clinician_id === currentClinician?.id;
  });

  // Today's appointments: scheduled today with status 'scheduled'
  const todayAppointments = clinicianAppointments.filter(apt => 
    isToday(new Date(apt.start_at)) && apt.status === 'scheduled'
  );

  // Outstanding documentation: scheduled today or before with status 'scheduled'
  const outstandingDocumentation = clinicianAppointments.filter(apt => {
    const appointmentDate = new Date(apt.start_at);
    return !isAfter(appointmentDate, endOfDay(today)) && 
           apt.status === 'scheduled';
  });

  // Future appointments: scheduled after today (any status)
  const futureAppointments = clinicianAppointments.filter(apt => {
    const appointmentDate = new Date(apt.start_at);
    return isAfter(appointmentDate, endOfDay(today));
  }).slice(0, 10); // Limit to first 10 future appointments


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
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                       <span className="font-medium">
                         {appointment.clients?.client_first_name && appointment.clients?.client_last_name 
                           ? `${appointment.clients.client_first_name} ${appointment.clients.client_last_name}`
                           : 'Unknown Client'}
                       </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {format(new Date(appointment.start_at), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {format(new Date(appointment.start_at), 'h:mm a')} - {format(new Date(appointment.end_at), 'h:mm a')}
                    </div>
                    <p className="text-sm mb-3">{appointment.type}</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                      appointment.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'documented' ? 'bg-blue-100 text-blue-700' :
                      appointment.status === 'no show' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {appointment.status}
                    </div>
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
            {outstandingDocumentation.length > 0 ? (
              outstandingDocumentation.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                     <span className="font-medium">
                         {appointment.clients?.client_first_name && appointment.clients?.client_last_name 
                           ? `${appointment.clients.client_first_name} ${appointment.clients.client_last_name}`
                           : 'Unknown Client'}
                     </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {format(new Date(appointment.start_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {format(new Date(appointment.start_at), 'h:mm a')} - {format(new Date(appointment.end_at), 'h:mm a')}
                  </div>
                  <p className="text-sm mb-3">{appointment.type}</p>
                  <Link to={`/templates/session-documentation?client_id=${appointment.client_id}&appointment_id=${appointment.id}`}>
                    <Button className="w-full mb-2">
                      <FileText className="h-4 w-4 mr-2" />
                      Document Session
                    </Button>
                  </Link>
                  {appointment.status === 'no show' && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Session Did Not Occur
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No outstanding documentation.</p>
              </div>
            )}
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
            {futureAppointments.length > 0 ? (
              <div className="space-y-4">
                {futureAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(appointment.start_at), 'h:mm a')} - {format(new Date(appointment.end_at), 'h:mm a')}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {format(new Date(appointment.start_at), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                         <span className="font-medium">
                             {appointment.clients?.client_first_name && appointment.clients?.client_last_name 
                               ? `${appointment.clients.client_first_name} ${appointment.clients.client_last_name}`
                               : 'Unknown Client'}
                         </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No upcoming appointments.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
