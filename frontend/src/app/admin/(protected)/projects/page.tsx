"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Code2,
  ExternalLink,
  Star,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

// Represents the project data returned by our FastAPI backend.
interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Holds the values entered in the project form.
// Represents the response returned after uploading an image.
interface ImageUploadResponse {
  image_url: string;
  path: string;
}

interface ProjectForm {
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  github_url: string;
  technologies: string;
  featured: boolean;
  display_order: number;
}

// Initial values used when creating a new project.
const INITIAL_FORM: ProjectForm = {
  title: "",
  description: "",
  image_url: "",
  live_url: "",
  github_url: "",
  technologies: "",
  featured: false,
  display_order: 0,
};

// Extract the Storage object path from a public Supabase image URL.
function getProjectStoragePath(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  const marker =
    "/storage/v1/object/public/portfolio-projects/";

  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) return null;

  const encodedPath = imageUrl
    .slice(markerIndex + marker.length)
    .split("?")[0];

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}


// Encode each Storage path segment for the delete endpoint.
function encodeStoragePath(path: string): string {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}


export default function ProjectsPage() {
  // Stores the projects retrieved from the backend.
  const [projects, setProjects] = useState<Project[]>([]);

  // Controls loading, form submission, and user feedback.
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Controls the create/edit form.
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(INITIAL_FORM);

  // Stores the selected image file before uploading it.
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Stores a temporary browser preview URL.
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generate and release the temporary preview URL when the file changes.
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  // Retrieves all projects using our centralized API client.
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<Project[]>("/projects/");

      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load projects.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load projects when the page is opened.
  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  // Opens an empty form for creating a project.
  function openCreateForm() {
    setEditingProject(null);
    setSelectedImage(null);
    setForm(INITIAL_FORM);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  // Opens the form with the selected project's existing information.
  function openEditForm(project: Project) {
    setEditingProject(project);
    setSelectedImage(null);

    setForm({
      title: project.title,
      description: project.description,
      image_url: project.image_url || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      technologies: project.technologies.join(", "),
      featured: project.featured,
      display_order: project.display_order,
    });

    setError("");
    setNotice("");
    setFormOpen(true);
  }

  // Uploads a selected image first, then creates or updates the project.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    let uploadedImagePath: string | null = null;

    // Remember the previous image so it can be cleaned up after a successful update.
    const previousImagePath = getProjectStoragePath(
      editingProject?.image_url || null,
    );

    try {
      let imageUrl = form.image_url.trim() || null;

      // Upload the selected file through the protected FastAPI endpoint.
      if (selectedImage) {
        const uploadData = new FormData();
        uploadData.append("file", selectedImage);

        const uploaded = await apiRequest<ImageUploadResponse>(
          "/uploads/projects",
          {
            method: "POST",
            body: uploadData,
          },
        );

        imageUrl = uploaded.image_url;
        uploadedImagePath = uploaded.path;
      }

      // Convert comma-separated technologies into an array.
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image_url: imageUrl,
        live_url: form.live_url.trim() || null,
        github_url: form.github_url.trim() || null,
        technologies: form.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
        featured: form.featured,
        display_order: Number(form.display_order) || 0,
      };

      if (editingProject) {
        // PATCH updates only the selected project.
        await apiRequest(`/projects/${editingProject.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        setNotice("Project updated successfully.");
      } else {
        // POST creates a new project with its uploaded image URL.
        await apiRequest("/projects/", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setNotice("Project created successfully.");
      }

      // Remove the previous image only after the database update succeeds.
      if (
        editingProject &&
        previousImagePath &&
        (selectedImage !== null || imageUrl === null)
      ) {
        try {
          await apiRequest(
            `/uploads/${encodeStoragePath(previousImagePath)}`,
            { method: "DELETE" },
          );
        } catch {
          setNotice(
            "Project saved, but the previous image could not be removed from Storage.",
          );
        }
      }

      // Reset the form and refresh the latest database records.
      setFormOpen(false);
      setEditingProject(null);
      setSelectedImage(null);
      setForm(INITIAL_FORM);

      await loadProjects();
    } catch (err) {
      // Clean up a newly uploaded image if project saving fails.
      if (uploadedImagePath) {
        try {
          await apiRequest(
            `/uploads/${encodeStoragePath(uploadedImagePath)}`,
            { method: "DELETE" },
          );
        } catch {
          // Keep the original error visible even if cleanup fails.
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the project.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Deletes a selected project and then attempts to remove its image.
  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      // Delete the project database record first.
      await apiRequest(`/projects/${project.id}`, {
        method: "DELETE",
      });

      let cleanupFailed = false;

      // Remove its Storage image when the record has one.
      const imagePath = getProjectStoragePath(project.image_url);

      if (imagePath) {
        try {
          await apiRequest(
            `/uploads/${encodeStoragePath(imagePath)}`,
            { method: "DELETE" },
          );
        } catch {
          cleanupFailed = true;
        }
      }

      setNotice(
        cleanupFailed
          ? "Project deleted, but its Storage image could not be removed."
          : "Project deleted successfully.",
      );

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the project.",
      );
    }
  }

  return (
    <div className="space-y-8">

      {/* Page heading and Create Project button */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#6d5ce7]">
            Portfolio Management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Projects
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the projects displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6d5ce7] to-[#3978e8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={19} />
          Add Project
        </button>
      </section>

      {/* Displays API errors and successful operations */}
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

      {/* Project count */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6d5ce7]">
          <FolderKanban size={21} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-xl font-bold text-gray-900">
            {loading ? "..." : projects.length}
          </p>
        </div>
      </div>

      {/* Displays loading, empty state, or project cards */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Loading projects...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#6d5ce7]">
            <FolderKanban size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No projects yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Start building your portfolio by adding your first project.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6d5ce7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b4bd1]"
          >
            <Plus size={18} />
            Add Your First Project
          </button>
        </div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Project image or placeholder */}
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FolderKanban
                    size={42}
                    className="text-[#6d5ce7]/50"
                  />
                )}

                {project.featured && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6d5ce7] shadow-sm">
                    <Star size={13} />
                    Featured
                  </span>
                )}
              </div>

              {/* Project details and technology tags */}
              <div className="space-y-4 p-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {project.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-[#6d5ce7]"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                {/* Optional links to the live website and GitHub repository */}
                <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open live project"
                      className="text-gray-400 transition hover:text-[#6d5ce7]"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open GitHub repository"
                      className="text-gray-400 transition hover:text-gray-900"
                    >
                      <Code2 size={18} />
                    </a>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    {/* Opens the form with existing project values */}
                    <button
                      type="button"
                      onClick={() => openEditForm(project)}
                      aria-label={`Edit ${project.title}`}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-purple-50 hover:text-[#6d5ce7]"
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Deletes this project after confirmation */}
                    <button
                      type="button"
                      onClick={() => void handleDelete(project)}
                      aria-label={`Delete ${project.title}`}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Create and edit project modal */}
      {formOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-form-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            {/* Modal heading and close button */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="project-form-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the details of your portfolio project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close project form"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form sends validated data to the FastAPI backend */}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="project-title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Project Title *
                </label>

                <input
                  id="project-title"
                  type="text"
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Enter project title"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="project-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description *
                </label>

                <textarea
                  id="project-description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe your project..."
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
                />
              </div>

              {/* Project image upload and preview */}
              <div>
                <label
                  htmlFor="project-image"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Project Image
                </label>

                {/* Show the selected local preview or existing Storage image. */}
                <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
                  {imagePreview || form.image_url ? (
                    <img
                      src={imagePreview || form.image_url}
                      alt="Project image preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FolderKanban
                        size={36}
                        className="mx-auto mb-2"
                      />
                      <p className="text-sm">No project image selected</p>
                    </div>
                  )}
                </div>

                {/* The browser sends this file as multipart/form-data. */}
                <input
                  key={selectedImage?.name || "empty-image"}
                  id="project-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;

                    setError("");

                    if (!file) {
                      setSelectedImage(null);
                      return;
                    }

                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                    ];

                    if (!allowedTypes.includes(file.type)) {
                      setError("Only JPG, PNG, and WebP images are allowed.");
                      event.currentTarget.value = "";
                      return;
                    }

                    if (file.size > 5 * 1024 * 1024) {
                      setError("The image must not exceed 5 MB.");
                      event.currentTarget.value = "";
                      return;
                    }

                    setSelectedImage(file);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#6d5ce7] hover:file:bg-purple-100"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-gray-400">
                    JPG, PNG, or WebP · Maximum 5 MB
                  </p>

                  {/* Clears the new selection or removes the existing image. */}
                  {(selectedImage || form.image_url) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setForm({ ...form, image_url: "" });
                      }}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="project-github"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  GitHub Repository URL
                </label>

                <input
                  id="project-github"
                  type="url"
                  value={form.github_url}
                  onChange={(event) =>
                    setForm({ ...form, github_url: event.target.value })
                  }
                  placeholder="https://github.com/username/project"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="project-technologies"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Technologies
                </label>

                <input
                  id="project-technologies"
                  type="text"
                  value={form.technologies}
                  onChange={(event) =>
                    setForm({ ...form, technologies: event.target.value })
                  }
                  placeholder="React, Next.js, FastAPI, Supabase"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Separate technologies using commas.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      setForm({ ...form, featured: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 accent-[#6d5ce7]"
                  />
                  Feature this project
                </label>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="project-order"
                    className="text-sm text-gray-600"
                  >
                    Display Order
                  </label>

                  <input
                    id="project-order"
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        display_order: Number(event.target.value),
                      })
                    }
                    className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#6d5ce7]"
                  />
                </div>
              </div>

              {/* Show form errors without closing the modal */}
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6d5ce7] to-[#3978e8] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {saving
                    ? "Saving..."
                    : editingProject
                      ? "Save Changes"
                      : "Create Project"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
