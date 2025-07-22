
import React from 'react';
import { ProfileMenu } from '@/components/ProfileMenu';
import { usePracticeInfo } from '@/hooks/usePracticeInfo';

export const Header: React.FC = () => {
  const { data: practiceInfo } = usePracticeInfo();

  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {practiceInfo?.logo_url && (
          <img 
            src={practiceInfo.logo_url} 
            alt="Practice Logo" 
            className="h-10 w-auto object-contain"
          />
        )}
        {practiceInfo?.banner_url ? (
          <img 
            src={practiceInfo.banner_url} 
            alt="Practice Banner" 
            className="h-8 w-auto object-contain max-w-xs"
          />
        ) : (
          <h1 className="text-xl font-semibold text-foreground">
            {practiceInfo?.practice_name || 'ValorWell EHR'}
          </h1>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <ProfileMenu />
      </div>
    </header>
  );
};
