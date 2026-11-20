from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.dependencies.auth import get_current_admin
from app.schemas.messages import MessageResponse, MessageStatus, MessageUpdate
from app.services.message_service import (
    delete_message,
    get_all_messages,
    get_message_by_id,
    update_message_status,
)

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/", response_model=list[MessageResponse])
def read_messages(
    status_filter: MessageStatus | None = Query(default=None, alias="status"),
    _admin=Depends(get_current_admin),
):
    value = status_filter.value if status_filter else None
    return get_all_messages(value)


@router.get("/{message_id}", response_model=MessageResponse)
def read_message(
    message_id: UUID,
    _admin=Depends(get_current_admin),
):
    message = get_message_by_id(message_id)

    if message is None:
        raise HTTPException(status_code=404, detail="Message not found.")

    return message


@router.patch("/{message_id}", response_model=MessageResponse)
def update_message_route(
    message_id: UUID,
    payload: MessageUpdate,
    _admin=Depends(get_current_admin),
):
    message = update_message_status(message_id, payload.status.value)

    if message is None:
        raise HTTPException(status_code=404, detail="Message not found.")

    return message


@router.delete("/{message_id}", status_code=204)
def delete_message_route(
    message_id: UUID,
    _admin=Depends(get_current_admin),
):
    if not delete_message(message_id):
        raise HTTPException(status_code=404, detail="Message not found.")

    return Response(status_code=204)
