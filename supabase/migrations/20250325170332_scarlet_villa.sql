/*
  # Update Email Notification System

  1. Changes
    - Drop and recreate email formatting function with new return type
    - Update notification trigger function to use HTTP helper
    - Add performance indexes for logging

  2. Security
    - Maintain existing RLS policies
    - Use security definer for sensitive operations
*/

-- Drop existing function to allow return type change
DROP FUNCTION IF EXISTS format_submission_email(form_submissions);

-- Improve email formatting function
CREATE OR REPLACE FUNCTION format_submission_email(
  submission_data form_submissions
) RETURNS jsonb AS $$
DECLARE
  contact_info jsonb := submission_data.contact_info;
  assessment_data jsonb := submission_data.assessment_data;
BEGIN
  RETURN jsonb_build_object(
    'text', format(
      E'New Risk Assessment Submission\n\n' ||
      E'Submission ID: %s\n' ||
      E'Timestamp: %s\n\n' ||
      E'Contact Information:\n' ||
      E'Name: %s\n' ||
      E'Email: %s\n' ||
      E'Phone: %s\n\n' ||
      E'Assessment Results:\n' ||
      E'Risk Score: %s\n' ||
      E'Risk Level: %s\n',
      submission_data.id,
      submission_data.created_at,
      contact_info->>'name',
      contact_info->>'email',
      contact_info->>'phone',
      assessment_data->>'score',
      assessment_data->>'riskLevel'
    ),
    'html', format(
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' ||
      '<h1 style="color: #2563eb;">New Risk Assessment Submission</h1>' ||
      '<div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">' ||
      '<p><strong>Submission ID:</strong> %s</p>' ||
      '<p><strong>Timestamp:</strong> %s</p>' ||
      '</div>' ||
      '<h2 style="color: #374151;">Contact Information</h2>' ||
      '<div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">' ||
      '<p><strong>Name:</strong> %s</p>' ||
      '<p><strong>Email:</strong> %s</p>' ||
      '<p><strong>Phone:</strong> %s</p>' ||
      '</div>' ||
      '<h2 style="color: #374151;">Assessment Results</h2>' ||
      '<div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">' ||
      '<p><strong>Risk Score:</strong> %s</p>' ||
      '<p><strong>Risk Level:</strong> %s</p>' ||
      '</div>' ||
      '</div>',
      submission_data.id,
      submission_data.created_at,
      contact_info->>'name',
      contact_info->>'email',
      contact_info->>'phone',
      assessment_data->>'score',
      assessment_data->>'riskLevel'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger function to update it
DROP FUNCTION IF EXISTS notify_form_submission() CASCADE;

-- Enhance notification function with error handling
CREATE OR REPLACE FUNCTION notify_form_submission()
RETURNS TRIGGER AS $$
DECLARE
  email_content jsonb;
  response jsonb;
  error_details text;
BEGIN
  -- Format email content
  email_content := format_submission_email(NEW);
  
  BEGIN
    -- Send email via SendGrid using the http_post_request helper
    response := http_post_request(
      'https://api.sendgrid.com/v3/mail/send',
      jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.sendgrid_key', true),
        'Content-Type', 'application/json'
      ),
      jsonb_build_object(
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
        'subject', format('New Risk Assessment Submission - %s', NEW.id),
        'content', jsonb_build_array(
          jsonb_build_object(
            'type', 'text/plain',
            'value', email_content->>'text'
          ),
          jsonb_build_object(
            'type', 'text/html',
            'value', email_content->>'html'
          )
        )
      )
    );

    -- Log successful notification
    INSERT INTO email_notification_logs (
      submission_id,
      status,
      error_message
    ) VALUES (
      NEW.id,
      'success',
      NULL
    );

  EXCEPTION WHEN OTHERS THEN
    -- Capture error details
    error_details := format(
      'Error sending notification: %s. SQLSTATE: %s',
      SQLERRM,
      SQLSTATE
    );

    -- Log failed notification
    INSERT INTO email_notification_logs (
      submission_id,
      status,
      error_message
    ) VALUES (
      NEW.id,
      'error',
      error_details
    );
    
    -- Note: We don't raise an exception here to prevent the trigger from failing
    -- Instead, we log the error and allow the submission to be saved
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER form_submission_notification
  AFTER INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_form_submission();

-- Add index for faster log queries
CREATE INDEX IF NOT EXISTS idx_email_logs_submission_id 
  ON email_notification_logs(submission_id);

-- Add index for faster status queries
CREATE INDEX IF NOT EXISTS idx_email_logs_status 
  ON email_notification_logs(status);