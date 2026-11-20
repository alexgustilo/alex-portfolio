import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_contact_notification(message: dict) -> bool:
    """
    Send an email notification when SMTP is configured.
    The contact message is already saved before this function runs.
    """
    host = settings.smtp_host
    recipient = settings.contact_recipient_email
    sender = settings.smtp_from_email or settings.smtp_username

    if not host or not recipient or not sender:
        return False

    email = EmailMessage()
    email["Subject"] = (
        f"Portfolio contact: {message.get('subject') or 'New message'}"
    )
    email["From"] = sender
    email["To"] = recipient
    email["Reply-To"] = message["email"]
    email.set_content(
        f"Name: {message['name']}\n"
        f"Email: {message['email']}\n"
        f"Subject: {message.get('subject') or 'No subject'}\n\n"
        f"{message['message']}"
    )

    try:
        with smtplib.SMTP(host, settings.smtp_port, timeout=15) as server:
            if settings.smtp_use_tls:
                server.starttls()

            if settings.smtp_username and settings.smtp_password:
                server.login(
                    settings.smtp_username,
                    settings.smtp_password.get_secret_value(),
                )

            server.send_message(email)

        return True
    except (OSError, smtplib.SMTPException):
        return False
