/*
  # Setup HTTP Extension and Helper Functions

  1. Extensions
    - Enables the HTTP extension for making external API calls
    - Creates helper function for HTTP requests

  2. Security
    - Grants necessary permissions to authenticated users
    - Uses secure function execution context
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO authenticated;

-- Create helper function for HTTP requests
CREATE OR REPLACE FUNCTION http_post_request(
  url text,
  headers jsonb,
  body jsonb
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  -- Validate inputs
  IF url IS NULL OR url = '' THEN
    RAISE EXCEPTION 'URL cannot be null or empty';
  END IF;

  -- Make HTTP POST request
  SELECT 
    COALESCE(
      (SELECT content::jsonb 
       FROM http.post(
         url,
         headers::text::jsonb,
         body::text::jsonb
       )),
      '{}'::jsonb
    ) INTO result;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  -- Log error and re-raise
  RAISE NOTICE 'HTTP request failed: %', SQLERRM;
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;