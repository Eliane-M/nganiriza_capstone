from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_email(recipient_email, subject, html_body):
    try:
        send_mail(
            subject=subject,
            message="",  # plain text fallback (can be empty if only HTML)
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_body,
        )
        logger.info(f"Email sent successfully to {recipient_email}")
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")


# Example: Reset password email
from authentication.services.emails.templates.reset import reset_password_template
def reset_email_password(recipient_email, employee_name, code):
    subject = "Reset Password"
    html_body = reset_password_template.format(employee_name=employee_name, code=code)
    send_email(recipient_email, subject, html_body)


# Example: New account email
from authentication.services.emails.templates.register import register_user_template
def new_account_email(recipient_email, client_name):
    subject = "New account created"
    html_body = register_user_template.format(client_name=client_name)
    send_email(recipient_email, subject, html_body)


# Example: Confirm reset
from authentication.services.emails.templates.confirm_reset import confirm_reset_template
def confirm_reset_email(recipient_email, client_name):
    subject = "Confirm password reset"
    html_body = confirm_reset_template.format(client_name=client_name)
    send_email(recipient_email, subject, html_body)
