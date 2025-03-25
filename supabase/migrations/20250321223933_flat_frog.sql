/*
  # Form Submission Email Notifications

  1. New Tables
    - `form_submissions`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `contact_info` (jsonb)
      - `assessment_data` (jsonb)
      - `created_at` (timestamp)

  2. Functions
    - Creates function to format and send email notifications

  3. Triggers
    - Creates trigger to send email on new form submissions

  4. Security
    - Enables RLS on form_submissions table
    - Adds policy for authenticated users to insert their own submissions
*/

-- Create form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES auth.users(id),
  contact_info jsonb NOT NULL,
  assessment_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting submissions
CREATE POLICY "Users can insert their own submissions"
  ON form_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

-- Create policy for viewing submissions
CREATE POLICY "Users can view their own submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

-- Function to format email content
CREATE OR REPLACE FUNCTION format_submission_email(
  submission_data form_submissions
) RETURNS text AS $$
DECLARE
  email_content text;
BEGIN
  email_content := format(
    E'New Form Submission\n\n' ||
    E'Submission ID: %s\n' ||
    E'Timestamp: %s\n\n' ||
    E'Contact Information:\n%s\n\n' ||
    E'Assessment Results:\n%s',
    submission_data.id,
    submission_data.created_at,
    submission_data.contact_info::text,
    submission_data.assessment_data::text
  );
  
  RETURN email_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notification function
CREATE OR REPLACE FUNCTION notify_form_submission()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://api.sendgrid.com/v3/mail/send',
    headers := jsonb_build_object(
      'Authorization', current_setting('app.settings.sendgrid_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'personalizations', jsonb_build_array(
        jsonb_build_object(
          'to', jsonb_build_array(
            jsonb_build_object(
              'email', 'agaguy@gmail.com',
              'name', 'Risk Assessment Admin'
            )
          )
        )
      ),
      'from', jsonb_build_object(
        'email', 'notifications@risknumber.com',
        'name', 'Risk Assessment System'
      ),
      'subject', 'New Risk Assessment Submission',
      'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'text/plain',
          'value', format_submission_email(NEW)
        )
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER form_submission_notification
  AFTER INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_form_submission();

-- Create error logging table
CREATE TABLE IF NOT EXISTS email_notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES form_submissions(id),
  status text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on logs
ALTER TABLE email_notification_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing logs
CREATE POLICY "Admin can view logs"
  ON email_notification_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT usrs.id 
    FROM auth.users usrs 
    WHERE usrs.email = 'agaguy@gmail.com'
  ));