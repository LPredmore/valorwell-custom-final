-- Database Enums
-- This file contains all custom enum types from the Supabase database

-- Biological Sex Enum
CREATE TYPE "Biological Sex" AS ENUM (
  'Male',
  'Female'
);

-- Appointment Status Enum  
CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'documented',
  'no show',
  'cancelled'
);

-- Specialty Type Enum
CREATE TYPE specialty_type AS ENUM (
  'Mental Health',
  'Speech Therapy'
);

-- States Enum
CREATE TYPE states AS ENUM (
  'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 
  'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 
  'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
  'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virgin Islands', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 
  'Wyoming'
);

-- Time Zones Enum
CREATE TYPE time_zones AS ENUM (
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Phoenix'
);

-- User Role Enum
CREATE TYPE user_role AS ENUM (
  'client',
  'clinician', 
  'admin'
);