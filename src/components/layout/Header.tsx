
import React from 'react';
import { ProfileMenu } from '@/components/ProfileMenu';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-foreground">ValorWell EHR</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <ProfileMenu />
      </div>
    </header>
  );
};
