
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Phone, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoCallProps {
  appointmentId: string;
  videoRoomUrl?: string;
  isHost?: boolean;
  clientName?: string;
  startTime?: Date;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  appointmentId,
  videoRoomUrl,
  isHost = false,
  clientName,
  startTime
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callState, setCallState] = useState<'waiting' | 'joining' | 'joined' | 'ended'>('waiting');
  const { toast } = useToast();

  useEffect(() => {
    // Load Daily.co script dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.onload = () => {
      console.log('Daily.co script loaded');
    };
    document.head.appendChild(script);

    return () => {
      if (callFrame) {
        callFrame.destroy();
      }
    };
  }, []);

  const joinCall = async () => {
    if (!videoRoomUrl) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No video room URL available for this appointment',
      });
      return;
    }

    setIsLoading(true);
    setCallState('joining');

    try {
      // @ts-ignore - Daily is loaded dynamically
      const frame = window.DailyIframe.createFrame({
        iframeStyle: {
          position: 'relative',
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      });

      frame.join({ 
        url: videoRoomUrl,
        userName: isHost ? 'Clinician' : (clientName || 'Client')
      });

      frame.on('joined-meeting', () => {
        setCallState('joined');
        setIsLoading(false);
        toast({
          title: 'Success',
          description: 'Successfully joined the video call',
        });
      });

      frame.on('left-meeting', () => {
        setCallState('ended');
        frame.destroy();
      });

      frame.on('error', (error: any) => {
        console.error('Daily error:', error);
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Failed to connect to video call',
        });
      });

      setCallFrame(frame);
      
      // Mount the frame to the container
      const container = document.getElementById('daily-call-container');
      if (container) {
        container.appendChild(frame.iframe());
      }

    } catch (error) {
      console.error('Error joining call:', error);
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to join video call',
      });
    }
  };

  const toggleVideo = () => {
    if (callFrame) {
      callFrame.setLocalVideo(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (callFrame) {
      callFrame.setLocalAudio(!isAudioOn);
      setIsAudioOn(!isAudioOn);
    }
  };

  const leaveCall = () => {
    if (callFrame) {
      callFrame.leave();
      setCallState('ended');
    }
  };

  if (callState === 'joined') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 bg-background border-b">
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="bg-green-500 text-white">Live</Badge>
            {clientName && <span className="text-sm text-muted-foreground">with {clientName}</span>}
          </div>
          <div className="flex space-x-2">
            <Button
              variant={isVideoOn ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              variant={isAudioOn ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
            >
              {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button variant="destructive" size="sm" onClick={leaveCall}>
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div id="daily-call-container" className="flex-1" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Video className="w-5 h-5" />
          <span>Telehealth Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clientName && (
          <div className="text-sm text-muted-foreground">
            Session with: <span className="font-medium">{clientName}</span>
          </div>
        )}
        
        {startTime && (
          <div className="text-sm text-muted-foreground">
            Scheduled: {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString()}
          </div>
        )}

        <div className="space-y-3">
          {callState === 'waiting' && (
            <Button 
              onClick={joinCall} 
              disabled={isLoading || !videoRoomUrl}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Join Video Call'}
            </Button>
          )}

          {callState === 'ended' && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Call ended</p>
              <Button onClick={joinCall} className="mt-2">
                Rejoin Call
              </Button>
            </div>
          )}
        </div>

        {!videoRoomUrl && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Video room not available for this appointment. Please contact support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
