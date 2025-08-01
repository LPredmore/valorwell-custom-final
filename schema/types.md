# Database Types Reference

## Custom Enums

### appointment_status
- `scheduled` - Appointment is scheduled and active
- `documented` - Session completed and documented  
- `no show` - Client did not attend scheduled appointment
- `cancelled` - Appointment was cancelled

### user_role
- `client` - Patient/client user
- `clinician` - Healthcare provider/therapist
- `admin` - System administrator

### specialty_type
- `Mental Health` - Mental health services
- `Speech Therapy` - Speech and language therapy

### states
All US states, territories, and districts including:
- All 50 US states
- District of Columbia
- Puerto Rico
- Guam
- American Samoa
- Northern Mariana Islands
- Virgin Islands

### time_zones
Supported timezone values:
- `America/New_York` (Eastern)
- `America/Chicago` (Central)  
- `America/Denver` (Mountain)
- `America/Los_Angeles` (Pacific)
- `America/Anchorage` (Alaska)
- `Pacific/Honolulu` (Hawaii)
- `America/Phoenix` (Arizona - no DST)

### "Biological Sex"
- `Male`
- `Female`

## Common Data Types

### UUID Fields
- All primary keys use `uuid` type with `gen_random_uuid()` default
- Foreign key references also use `uuid` type

### Timestamp Fields
- `created_at` - timestamptz with default `now()`
- `updated_at` - timestamptz with default `now()` and trigger updates
- All datetime fields use `timestamptz` (timestamp with time zone)

### JSON Fields
- `jsonb` type used for structured data storage
- Includes form data, API responses, metadata

### Text Fields
- Most text fields use `text` type (unlimited length)
- Some specific fields use `char(1)` or `char(2)` for codes
- Arrays use `text[]` type

### Numeric Fields
- Financial amounts use `numeric` type for precision
- Counts and IDs use `integer` type
- Time durations in minutes use `integer`

## Indexes

### Performance Indexes
- Primary key indexes (automatic)
- Foreign key indexes for joins
- Date range indexes for calendar queries
- Email and identifier indexes for lookups

### Unique Constraints
- Email uniqueness where applicable
- Code uniqueness for reference tables
- Composite unique constraints for relationships

## Security

### Row Level Security (RLS)
- Enabled on all user-facing tables
- Policies based on user roles and ownership
- Auth context (`auth.uid()`) used for user identification

### Access Patterns
- **Admins**: Full access to configuration tables
- **Clinicians**: Access to their clients and appointments
- **Clients**: Access to their own records only
- **Public**: Read-only access to reference data (CPT codes, etc.)