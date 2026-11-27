from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.dependencies.auth import get_current_admin
from app.features.certificates.schemas import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
)
from app.features.certificates.service import (
    create_certificate,
    delete_certificate,
    get_all_certificates,
    get_certificate_by_id,
    update_certificate,
)

router = APIRouter(prefix="/certificates", tags=["Certificates"])


@router.get("/", response_model=list[CertificateResponse])
def read_certificates():
    return get_all_certificates()


@router.get("/{certificate_id}", response_model=CertificateResponse)
def read_certificate(certificate_id: UUID):
    certificate = get_certificate_by_id(certificate_id)

    if certificate is None:
        raise HTTPException(status_code=404, detail="Certificate not found.")

    return certificate


@router.post("/", response_model=CertificateResponse, status_code=201)
def create_certificate_route(
    payload: CertificateCreate,
    _admin=Depends(get_current_admin),
):
    return create_certificate(payload.model_dump(mode="json"))


@router.patch("/{certificate_id}", response_model=CertificateResponse)
def update_certificate_route(
    certificate_id: UUID,
    payload: CertificateUpdate,
    _admin=Depends(get_current_admin),
):
    data = payload.model_dump(exclude_unset=True, mode="json")

    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")

    for required_field in ("title", "issuer"):
        if required_field in data and data[required_field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{required_field} cannot be null.",
            )

    certificate = update_certificate(certificate_id, data)

    if certificate is None:
        raise HTTPException(status_code=404, detail="Certificate not found.")

    return certificate


@router.delete(
    "/{certificate_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_certificate_route(
    certificate_id: UUID,
    _admin=Depends(get_current_admin),
):
    if not delete_certificate(certificate_id):
        raise HTTPException(status_code=404, detail="Certificate not found.")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
