from fastapi import APIRouter, status

from app.schemas.contact import ContactCreate, ContactSubmissionResponse
from app.services.contact_service import create_contact_message
from app.services.email_service import send_contact_notification

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post(
    "/",
    response_model=ContactSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_contact_message(payload: ContactCreate):
    message_data = payload.model_dump(mode="json")

    create_contact_message(message_data)
    email_sent = send_contact_notification(message_data)

    return {
        "message": "Your message has been submitted successfully.",
        "email_notification_sent": email_sent,
    }
