"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Award,
  ExternalLink,
  FileImage,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type UploadResponse = {
  image_url: string;
  path: string;
};

type CertificateForm = {
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  image_url: string;
  description: string;
  display_order: number;
};

const INITIAL_FORM: CertificateForm = {
  title: "",
  issuer: "",
  issue_date: "",
  credential_url: "",
  image_url: "",
  description: "",
  display_order: 0,
};

const INPUT_CLASS =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10";

function getImageFilename(imageUrl: string): string | null {
  try {
    const pathname = new URL(imageUrl).pathname;
    const filename = pathname.split("/").pop();

    return filename ? decodeURIComponent(filename) : null;
  } catch {
    return null;
  }
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);

  const [form, setForm] = useState<CertificateForm>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Retrieves certificates from the FastAPI backend.
  const loadCertificates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<Certificate[]>("/certificates/");
      setCertificates(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load certificates.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates();
  }, [loadCertificates]);

  // Clears temporary image preview resources.
  function clearImageSelection() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
  }

  // Opens a blank form.
  function openCreateForm() {
    setEditingCertificate(null);
    setForm(INITIAL_FORM);
    clearImageSelection();
    setRemoveExistingImage(false);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  // Opens a form with the selected certificate.
  function openEditForm(certificate: Certificate) {
    clearImageSelection();

    setEditingCertificate(certificate);
    setForm({
      title: certificate.title,
      issuer: certificate.issuer,
      issue_date: certificate.issue_date?.slice(0, 10) || "",
      credential_url: certificate.credential_url || "",
      image_url: certificate.image_url || "",
      description: certificate.description || "",
      display_order: certificate.display_order,
    });

    setRemoveExistingImage(false);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving || uploading) return;

    clearImageSelection();
    setFormOpen(false);
    setEditingCertificate(null);
    setRemoveExistingImage(false);
  }

  // Handles certificate image selection and preview.
  function handleImageChange(file?: File) {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Certificate image must not exceed 5 MB.");
      return;
    }

    clearImageSelection();

    const preview = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);
    setRemoveExistingImage(false);
    setError("");
  }

  // Uploads the selected image to the certificate storage bucket.
  async function uploadCertificateImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<UploadResponse>("/uploads/certificates", {
      method: "POST",
      body: formData,
    });
  }

  // Removes an uploaded certificate image from Supabase Storage.
  async function deleteCertificateImage(imageUrl: string) {
    const filename = getImageFilename(imageUrl);

    if (!filename) {
      throw new Error("Unable to identify the certificate image filename.");
    }

    await apiRequest(
      `/uploads/certificates/${encodeURIComponent(filename)}`,
      { method: "DELETE" },
    );
  }

  // Creates or updates a certificate.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    let uploadedImageUrl: string | null = null;

    const oldImageUrl = editingCertificate?.image_url || null;

    try {
      let imageUrl = form.image_url || null;

      if (imageFile) {
        setUploading(true);

        const uploaded = await uploadCertificateImage(imageFile);
        imageUrl = uploaded.image_url;
        uploadedImageUrl = uploaded.image_url;

        setUploading(false);
      } else if (removeExistingImage) {
        imageUrl = null;
      }

      const payload = {
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        issue_date: form.issue_date || null,
        credential_url: form.credential_url.trim() || null,
        image_url: imageUrl,
        description: form.description.trim() || null,
        display_order: Number(form.display_order) || 0,
      };

      if (editingCertificate) {
        await apiRequest(`/certificates/${editingCertificate.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/certificates/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      // Delete the previous image only after the database save succeeds.
      if (
        oldImageUrl &&
        oldImageUrl !== imageUrl
      ) {
        try {
          await deleteCertificateImage(oldImageUrl);
        } catch {
          setNotice(
            "Certificate saved, but the previous image could not be deleted from storage.",
          );
        }
      }

      if (!notice) {
        setNotice(
          editingCertificate
            ? "Certificate updated successfully."
            : "Certificate created successfully.",
        );
      }

      clearImageSelection();
      setFormOpen(false);
      setEditingCertificate(null);
      setForm(INITIAL_FORM);
      setRemoveExistingImage(false);

      await loadCertificates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the certificate.",
      );

      // Avoid leaving an unused image in storage if the database save fails.
      if (uploadedImageUrl) {
        try {
          await deleteCertificateImage(uploadedImageUrl);
        } catch {
          setError(
            "Certificate save failed. The uploaded image may need manual cleanup in Supabase Storage.",
          );
        }
      }
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  // Deletes a certificate and its associated image.
  async function handleDelete(certificate: Certificate) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${certificate.title}"?`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await apiRequest(`/certificates/${certificate.id}`, {
        method: "DELETE",
      });

      let deletionNotice = "Certificate deleted successfully.";

      if (certificate.image_url) {
        try {
          await deleteCertificateImage(certificate.image_url);
        } catch {
          deletionNotice =
            "Certificate deleted, but its image could not be removed from storage.";
        }
      }

      setNotice(deletionNotice);
      await loadCertificates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the certificate.",
      );
    }
  }

  const previewImage = imagePreview ||
    (!removeExistingImage ? form.image_url : "");

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#6d5ce7]">
            Portfolio Management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Certificates
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the certificates and achievements displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6d5ce7] to-[#3978e8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={19} />
          Add Certificate
        </button>
      </section>

      {/* Error and success messages */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {notice}
        </div>
      )}

      {/* Certificate summary */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6d5ce7]">
            <Award size={21} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Certificates</p>
            <p className="text-xl font-bold text-gray-900">
              {loading ? "..." : certificates.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileImage size={21} />
          </div>

          <div>
            <p className="text-sm text-gray-500">With Images</p>
            <p className="text-xl font-bold text-gray-900">
              {loading
                ? "..."
                : certificates.filter((item) => item.image_url).length}
            </p>
          </div>
        </div>
      </section>

      {/* Loading and certificate list */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Loading certificates...
          </p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#6d5ce7]">
            <Award size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No certificates yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Start building your portfolio by adding your first certificate.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6d5ce7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b4bd1]"
          >
            <Plus size={18} />
            Add Your First Certificate
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
                {certificate.image_url ? (
                  <img
                    src={certificate.image_url}
                    alt={certificate.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#6d5ce7]">
                    <Award size={42} />
                    <span className="text-xs font-medium">
                      No certificate image
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h2 className="font-semibold leading-6 text-gray-900">
                      {certificate.title}
                    </h2>

                    <span className="shrink-0 rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-[#6d5ce7]">
                      #{certificate.display_order}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-gray-600">
                    {certificate.issuer}
                  </p>

                  {certificate.issue_date && (
                    <p className="mt-1 text-xs text-gray-400">
                      Issued{" "}
                      {new Date(
                        `${certificate.issue_date.slice(0, 10)}T00:00:00`,
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {certificate.description && (
                  <p className="line-clamp-3 text-sm leading-6 text-gray-500">
                    {certificate.description}
                  </p>
                )}

                {certificate.credential_url && (
                  <a
                    href={certificate.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6d5ce7] transition hover:text-[#3978e8]"
                  >
                    View Credential
                    <ExternalLink size={15} />
                  </a>
                )}

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditForm(certificate)}
                    aria-label={`Edit ${certificate.title}`}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-purple-50 hover:text-[#6d5ce7]"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(certificate)}
                    aria-label={`Delete ${certificate.title}`}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create and edit certificate modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-form-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="certificate-form-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editingCertificate
                    ? "Edit Certificate"
                    : "Add New Certificate"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your certificate information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving || uploading}
                aria-label="Close certificate form"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Certificate title */}
              <div>
                <label
                  htmlFor="certificate-title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Certificate Title *
                </label>

                <input
                  id="certificate-title"
                  type="text"
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Python Bootcamp Completion"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Issuer */}
              <div>
                <label
                  htmlFor="certificate-issuer"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Issuing Organization *
                </label>

                <input
                  id="certificate-issuer"
                  type="text"
                  required
                  maxLength={150}
                  value={form.issuer}
                  onChange={(event) =>
                    setForm({ ...form, issuer: event.target.value })
                  }
                  placeholder="e.g. PHINMA University of Iloilo"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Issue date and display order */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="certificate-date"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Issue Date
                  </label>

                  <input
                    id="certificate-date"
                    type="date"
                    value={form.issue_date}
                    onChange={(event) =>
                      setForm({ ...form, issue_date: event.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label
                    htmlFor="certificate-order"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Display Order
                  </label>

                  <input
                    id="certificate-order"
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        display_order: Number(event.target.value),
                      })
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Credential URL */}
              <div>
                <label
                  htmlFor="certificate-url"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Credential Verification URL
                </label>

                <input
                  id="certificate-url"
                  type="url"
                  value={form.credential_url}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      credential_url: event.target.value,
                    })
                  }
                  placeholder="https://example.com/verify"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Certificate description */}
              <div>
                <label
                  htmlFor="certificate-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="certificate-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Add a short description..."
                  className={`${INPUT_CLASS} resize-y`}
                />
              </div>

              {/* Certificate image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Certificate Image
                </label>

                {previewImage ? (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <img
                        src={previewImage}
                        alt="Certificate preview"
                        className="max-h-64 w-full object-contain"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        <Upload size={15} />
                        Change Image
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          clearImageSelection();
                          setForm({ ...form, image_url: "" });
                          setRemoveExistingImage(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center transition hover:border-[#6d5ce7] hover:bg-purple-50/30"
                  >
                    <ImagePlus size={28} className="text-[#6d5ce7]" />

                    <span className="mt-3 text-sm font-semibold text-gray-700">
                      Upload certificate image
                    </span>

                    <span className="mt-1 text-xs text-gray-400">
                      JPG, PNG, or WebP · Maximum 5 MB
                    </span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) =>
                    handleImageChange(event.target.files?.[0])
                  }
                />
              </div>

              {/* Form errors */}
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving || uploading}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6d5ce7] to-[#3978e8] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />

                  {uploading
                    ? "Uploading..."
                    : saving
                      ? "Saving..."
                      : editingCertificate
                        ? "Save Changes"
                        : "Create Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
