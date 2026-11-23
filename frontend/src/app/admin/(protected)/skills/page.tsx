"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Code2,
  Layers,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type SkillForm = {
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  display_order: number;
};

const INITIAL_FORM: SkillForm = {
  name: "",
  category: "",
  proficiency: 0,
  icon: "",
  display_order: 0,
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [form, setForm] = useState<SkillForm>(INITIAL_FORM);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Retrieves skills from the FastAPI backend.
  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<Skill[]>("/skills/");
      setSkills(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load skills.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Loads skills when the page opens.
  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  // Opens an empty form for creating a skill.
  function openCreateForm() {
    setEditingSkill(null);
    setForm(INITIAL_FORM);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  // Opens the form with the selected skill's existing values.
  function openEditForm(skill: Skill) {
    setEditingSkill(skill);

    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || "",
      display_order: skill.display_order,
    });

    setError("");
    setNotice("");
    setFormOpen(true);
  }

  // Creates or updates a skill through the backend.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      proficiency: Number(form.proficiency),
      icon: form.icon.trim() || null,
      display_order: Number(form.display_order) || 0,
    };

    try {
      if (editingSkill) {
        await apiRequest(`/skills/${editingSkill.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        setNotice("Skill updated successfully.");
      } else {
        await apiRequest("/skills/", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setNotice("Skill created successfully.");
      }

      setFormOpen(false);
      setEditingSkill(null);
      setForm(INITIAL_FORM);

      await loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the skill.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Deletes a selected skill after confirmation.
  async function handleDelete(skill: Skill) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await apiRequest(`/skills/${skill.id}`, {
        method: "DELETE",
      });

      setNotice("Skill deleted successfully.");
      await loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete the skill.",
      );
    }
  }

  // Groups skills by their category for easier management.
  const groupedSkills = skills.reduce<Record<string, Skill[]>>(
    (groups, skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }

      groups[skill.category].push(skill);
      return groups;
    },
    {},
  );

  const categories = Object.entries(groupedSkills);

  return (
    <div className="space-y-8">
      {/* Page heading and Add Skill button */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#6d5ce7]">
            Portfolio Management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Skills
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the technical skills displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6d5ce7] to-[#3978e8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={19} />
          Add Skill
        </button>
      </section>

      {/* API errors and success messages */}
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

      {/* Skills summary */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6d5ce7]">
            <Code2 size={21} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Skills</p>
            <p className="text-xl font-bold text-gray-900">
              {loading ? "..." : skills.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Layers size={21} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-xl font-bold text-gray-900">
              {loading ? "..." : categories.length}
            </p>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading skills...</p>
        </div>
      ) : skills.length === 0 ? (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#6d5ce7]">
            <Sparkles size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No skills yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Start building your portfolio by adding your first skill.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6d5ce7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b4bd1]"
          >
            <Plus size={18} />
            Add Your First Skill
          </button>
        </div>
      ) : (
        /* Skills grouped by category */
        <div className="space-y-6">
          {categories.map(([category, categorySkills]) => (
            <section
              key={category}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#6d5ce7]">
                    <Layers size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {category}
                    </h2>

                    <p className="text-xs text-gray-500">
                      {categorySkills.length}{" "}
                      {categorySkills.length === 1 ? "skill" : "skills"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {categorySkills.map((skill) => (
                  <article
                    key={skill.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 text-[#6d5ce7]">
                        {skill.icon ? (
                          <span className="text-lg">{skill.icon}</span>
                        ) : (
                          <Code2 size={20} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {skill.name}
                          </h3>

                          <span className="text-xs text-gray-400">
                            Order: {skill.display_order}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#6d5ce7] to-[#3978e8]"
                              style={{
                                width: `${skill.proficiency}%`,
                              }}
                            />
                          </div>

                          <span className="w-10 text-right text-xs font-semibold text-gray-500">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(skill)}
                        aria-label={`Edit ${skill.name}`}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-purple-50 hover:text-[#6d5ce7]"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(skill)}
                        aria-label={`Delete ${skill.name}`}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Add and Edit Skill modal */}
      {formOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-form-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            {/* Modal heading */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="skill-form-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the details of your technical skill.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                disabled={saving}
                aria-label="Close skill form"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Skill name */}
              <div>
                <label
                  htmlFor="skill-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Skill Name *
                </label>

                <input
                  id="skill-name"
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. React.js"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="skill-category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category *
                </label>

                <input
                  id="skill-category"
                  type="text"
                  required
                  maxLength={100}
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  placeholder="e.g. Frontend Development"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
                />
              </div>

              {/* Proficiency */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="skill-proficiency"
                    className="text-sm font-medium text-gray-700"
                  >
                    Proficiency
                  </label>

                  <span className="text-sm font-semibold text-[#6d5ce7]">
                    {form.proficiency}%
                  </span>
                </div>

                <input
                  id="skill-proficiency"
                  type="range"
                  min="0"
                  max="100"
                  value={form.proficiency}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      proficiency: Number(event.target.value),
                    })
                  }
                  className="w-full accent-[#6d5ce7]"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Select a value between 0 and 100.
                </p>
              </div>

              {/* Optional icon */}
              <div>
                <label
                  htmlFor="skill-icon"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Icon or Emoji
                </label>

                <input
                  id="skill-icon"
                  type="text"
                  value={form.icon}
                  onChange={(event) =>
                    setForm({ ...form, icon: event.target.value })
                  }
                  placeholder="e.g. ⚛️"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Optional. You can use an emoji or leave this empty.
                </p>
              </div>

              {/* Display order */}
              <div>
                <label
                  htmlFor="skill-order"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Display Order
                </label>

                <input
                  id="skill-order"
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      display_order: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
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
                    : editingSkill
                      ? "Save Changes"
                      : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
