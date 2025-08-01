-- Drop the incorrect function that references non-existent tables
DROP FUNCTION IF EXISTS get_template_structure(uuid);

-- Create the corrected function that works with existing templates table
CREATE OR REPLACE FUNCTION get_template_structure(p_template_id uuid)
RETURNS json
LANGUAGE sql
AS $$
  SELECT
    json_build_object(
      'id', t.id,
      'name', t.name,
      'description', t.description,
      'schema', t.schema_json
    )
  FROM public.templates t
  WHERE t.id = p_template_id;
$$;