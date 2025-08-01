-- Create function to get template structure
CREATE OR REPLACE FUNCTION get_template_structure(p_template_id uuid)
RETURNS json
LANGUAGE sql
AS $$
  SELECT
    json_build_object(
      'id', t.id,
      'name', t.name,
      'rows', (
        SELECT coalesce(json_agg(
          json_build_object(
            'id', r.id,
            'order', r.order,
            'columns', (
              SELECT coalesce(json_agg(
                json_build_object(
                  'id', c.id,
                  'order', c.order,
                  'width', c.width,
                  'fields', (
                    SELECT coalesce(json_agg(
                      json_build_object(
                        'id', f.id,
                        'order', f.order,
                        'label', f.label,
                        'name', f.name,
                        'type', f.type,
                        'placeholder', f.placeholder,
                        'options', f.options
                      ) ORDER BY f.order
                    ), '[]'::json)
                    FROM public.template_field f
                    WHERE f.column_id = c.id
                  )
                ) ORDER BY c.order
              ), '[]'::json)
              FROM public.template_column c
              WHERE c.row_id = r.id
            )
          ) ORDER BY r.order
        ), '[]'::json)
        FROM public.template_row r
        WHERE r.template_id = t.id
      )
    )
  FROM public.templates t
  WHERE t.id = p_template_id;
$$;