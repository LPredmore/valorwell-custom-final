
import React from 'react';
import { AdminUserCreator } from '@/components/AdminUserCreator';

const AdminUserCreation = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin User Creation</h1>
          <p className="text-gray-600 mt-2">Create admin users with full privileges</p>
        </div>
        <AdminUserCreator />
      </div>
    </div>
  );
};

export default AdminUserCreation;
