from pydantic import BaseModel


class ImageUploadResponse(BaseModel):
    # Public URL used by the portfolio to display the image.
    image_url: str

    # Storage path used when replacing or deleting the image.
    path: str
