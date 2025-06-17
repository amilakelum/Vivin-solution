"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getServiceCategory,
  updateServiceCategory,
} from "@/app/actions/services";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.category as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  // const [icon, setIcon] = useState("");

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      setError(null);
      const category = await getServiceCategory(categorySlug);
      if (!category) {
        setError("Category not found.");
      } else {
        setCategoryId(category.id);
        setTitle(category.title);
        setSlug(category.slug);
        setDescription(category.description || "");
        // setIcon(category.icon || "");
      }
      setLoading(false);
    }
    fetchCategory();
  }, [categorySlug]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!categoryId) return; // <-- Use the real id, not the slug

    const result = await updateServiceCategory(categoryId, {
      title,
      slug,
      description,
      // icon,
    });

    setSaving(false);

    if (result?.error) {
      setError(result.error.message || "Failed to update category.");
    } else {
      router.push("/admin/services");
      router.refresh();
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Edit Service Category</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Category Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            name="slug"
            required
            className="w-full border px-3 py-2 rounded bg-gray-100"
            placeholder="category_slug"
            value={slug}
            readOnly
            tabIndex={-1}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            className="w-full border px-3 py-2 rounded"
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* <div>
          <label className="block font-medium mb-1">Icon (URL or emoji)</label>
          <input
            name="icon"
            className="w-full border px-3 py-2 rounded"
            placeholder="🛠️ or https://..."
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
        </div> */}
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
