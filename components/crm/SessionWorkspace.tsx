"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Artwork, ClassReview, Student } from "@/lib/crm/types";

type Props = {
  sessionId: string;
  sessionTitle: string;
  artworks: Artwork[];
  reviews: ClassReview[];
  students: Student[];
};

export default function SessionWorkspace({
  sessionId,
  sessionTitle,
  artworks: initialArtworks,
  reviews: initialReviews,
  students,
}: Props) {
  const router = useRouter();
  const [artworks, setArtworks] = useState(initialArtworks);
  const [reviews, setReviews] = useState(initialReviews);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [genBusy, setGenBusy] = useState(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);
  const [reviewBusyId, setReviewBusyId] = useState<string | null>(null);

  useEffect(() => {
    setArtworks(initialArtworks);
  }, [initialArtworks]);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const studentName = useMemo(() => {
    const m = new Map(students.map((s) => [s.id, s.name]));
    return (id: string) => m.get(id) ?? id;
  }, [students]);

  async function refreshFromServer() {
    router.refresh();
  }

  async function uploadArtwork(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) return;

    setUploadBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("studentId", String(fd.get("studentId") ?? ""));
      const title = String(fd.get("title") ?? "").trim();
      const medium = String(fd.get("medium") ?? "").trim();
      const notes = String(fd.get("notes") ?? "").trim();
      if (title) body.append("title", title);
      if (medium) body.append("medium", medium);
      if (notes) body.append("notes", notes);

      const res = await fetch(`/api/admin/sessions/${sessionId}/artworks`, {
        method: "POST",
        credentials: "include",
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(typeof data.error === "string" ? data.error : "Upload failed.");
        return;
      }
      const artwork = data.artwork as Artwork | undefined;
      if (artwork) setArtworks((prev) => [...prev, artwork]);
      e.currentTarget.reset();
      await refreshFromServer();
    } finally {
      setUploadBusy(false);
    }
  }

  async function generateAll() {
    setGenBusy(true);
    setGenMessage(null);
    try {
      const res = await fetch(`/api/admin/sessions/${sessionId}/reviews/generate`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGenMessage(typeof data.error === "string" ? data.error : "Generation failed.");
        return;
      }
      const generated = data.generated as ClassReview[] | undefined;
      const errors = data.errors as Array<{ studentId: string; error: string }> | undefined;
      if (Array.isArray(generated)) {
        setReviews((prev) => {
          const byId = new Map(prev.map((r) => [r.id, r]));
          for (const r of generated) byId.set(r.id, r);
          return Array.from(byId.values()).filter((r) => r.sessionId === sessionId);
        });
      }
      const parts: string[] = [];
      if (generated?.length) parts.push(`Generated ${generated.length} review(s) with Claude.`);
      if (errors?.length) {
        parts.push(
          `Some rows failed: ${errors.map((x) => `${studentName(x.studentId)}: ${x.error}`).join("; ")}`
        );
      }
      setGenMessage(parts.join(" "));
      await refreshFromServer();
    } finally {
      setGenBusy(false);
    }
  }

  async function regenerate(reviewId: string) {
    setReviewBusyId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/regenerate`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(typeof data.error === "string" ? data.error : "Regeneration failed.");
        return;
      }
      const review = data.review as ClassReview | undefined;
      if (review) {
        setReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
      }
      await refreshFromServer();
    } finally {
      setReviewBusyId(null);
    }
  }

  async function approveReview(reviewId: string) {
    setReviewBusyId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(typeof data.error === "string" ? data.error : "Approve failed.");
        return;
      }
      const review = data.review as ClassReview | undefined;
      if (review) {
        setReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
      }
      await refreshFromServer();
    } finally {
      setReviewBusyId(null);
    }
  }

  async function saveReviewContent(reviewId: string, content: string) {
    setReviewBusyId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(typeof data.error === "string" ? data.error : "Save failed.");
        return;
      }
      const review = data.review as ClassReview | undefined;
      if (review) {
        setReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
      }
      await refreshFromServer();
    } finally {
      setReviewBusyId(null);
    }
  }

  const artworksByStudent = useMemo(() => {
    const map = new Map<string, Artwork[]>();
    for (const a of artworks) {
      const list = map.get(a.studentId) ?? [];
      list.push(a);
      map.set(a.studentId, list);
    }
    return map;
  }, [artworks]);

  async function deleteSession() {
    if (!confirm("Delete this session and its artworks/reviews from CRM?")) return;
    const res = await fetch(`/api/admin/sessions/${sessionId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      alert("Unable to delete session.");
      return;
    }
    router.push("/admin/sessions");
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="font-display text-2xl text-gray-darkest">{sessionTitle}</div>
        <p className="mt-2 text-sm text-gray-darker max-w-3xl">
          Upload artwork per student, then generate personalized reviews with Claude. Regenerate if you want a fresh draft;
          approve when the text is ready to share.
        </p>
      </div>

      <section className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow space-y-4">
        <div className="font-display text-lg text-gray-darkest">Upload artwork</div>
        <form onSubmit={uploadArtwork} className="grid gap-4 lg:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Student</span>
            <select
              name="studentId"
              required
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Image file</span>
            <input
              name="file"
              type="file"
              accept="image/*"
              required
              className="text-sm text-gray-darker file:mr-3 file:rounded-md file:border file:border-gray-lighter file:bg-white file:px-3 file:py-2 file:text-sm file:text-gray-darkest hover:file:border-accent-warm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Title (optional)</span>
            <input
              name="title"
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-darker">Medium (optional)</span>
            <input
              name="medium"
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm lg:col-span-2">
            <span className="text-gray-darker">Notes (optional)</span>
            <textarea
              name="notes"
              rows={2}
              className="rounded-md border border-gray-lighter bg-white px-3 py-2 text-gray-darkest outline-none focus:border-accent-warm"
            />
          </label>
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={uploadBusy}
              className="rounded-md bg-accent-warm px-5 py-2.5 text-sm font-medium text-gray-darkest hover:bg-accent-warm-light disabled:opacity-60 transition-colors"
            >
              {uploadBusy ? "Uploading…" : "Upload artwork"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="font-display text-lg text-gray-darkest">Claude reviews</div>
            <p className="text-sm text-gray-darker mt-1">
              Generates one review per student who has artwork in this session (Claude).
            </p>
          </div>
          <button
            type="button"
            onClick={() => void generateAll()}
            disabled={genBusy}
            className="shrink-0 rounded-md bg-gray-darkest px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-darker disabled:opacity-60 transition-colors"
          >
            {genBusy ? "Generating…" : "Generate reviews"}
          </button>
        </div>
        {genMessage ? (
          <div className="rounded-md border border-gray-lighter bg-white-warm px-4 py-3 text-sm text-gray-darker whitespace-pre-wrap">
            {genMessage}
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="font-display text-xl text-gray-darkest">Artworks</div>
        <div className="grid gap-4">
          {students.map((s) => {
            const list = artworksByStudent.get(s.id) ?? [];
            if (list.length === 0) return null;
            return (
              <div key={s.id} className="rounded-xl border border-gray-lighter bg-white p-4 card-shadow">
                <div className="text-sm font-medium text-gray-darkest">{s.name}</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((a) => (
                    <div key={a.id} className="rounded-lg border border-gray-lighter overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.imagePath}
                        alt={a.title ?? "Student artwork"}
                        className="w-full h-44 object-cover bg-gray-lightest"
                      />
                      <div className="p-3 text-xs text-gray-darker space-y-1">
                        {a.title ? <div className="text-gray-darkest">{a.title}</div> : null}
                        {a.medium ? <div>{a.medium}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {artworks.length === 0 ? (
            <div className="text-sm text-gray-dark border border-dashed border-gray-lighter rounded-lg p-6">
              No artwork yet — upload images above.
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div className="font-display text-xl text-gray-darkest">Reviews</div>
        <div className="grid gap-6">
          {reviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              studentLabel={studentName(r.studentId)}
              busy={reviewBusyId === r.id}
              onRegenerate={() => void regenerate(r.id)}
              onApprove={() => void approveReview(r.id)}
              onSaveContent={(content) => void saveReviewContent(r.id, content)}
            />
          ))}
          {reviews.length === 0 ? (
            <div className="text-sm text-gray-dark border border-dashed border-gray-lighter rounded-lg p-6">
              No reviews yet — upload artwork and run Claude generation.
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-red-100 bg-white p-6 space-y-3">
        <div className="font-display text-lg text-red-900">Delete session</div>
        <p className="text-sm text-gray-darker max-w-2xl">
          Permanently removes this session and related artworks and reviews stored in CRM.
        </p>
        <button
          type="button"
          onClick={() => void deleteSession()}
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-50 transition-colors"
        >
          Delete session
        </button>
      </section>
    </div>
  );
}

function ReviewCard(props: {
  review: ClassReview;
  studentLabel: string;
  busy: boolean;
  onRegenerate: () => void;
  onApprove: () => void;
  onSaveContent: (content: string) => void;
}) {
  const { review, studentLabel, busy, onRegenerate, onApprove, onSaveContent } = props;
  const [draft, setDraft] = useState(review.content);

  useEffect(() => {
    setDraft(review.content);
  }, [review.content, review.version]);

  return (
    <div className="rounded-xl border border-gray-lighter bg-white p-6 card-shadow space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-gray-darkest">{studentLabel}</div>
          <div className="text-xs text-gray-dark mt-1">
            Status:{" "}
            <span className="text-gray-darker capitalize">{review.status}</span>
            <span className="mx-2 text-gray-light">·</span>
            <span>v{review.version}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onSaveContent(draft)}
            className="rounded-md border border-gray-lighter px-3 py-2 text-xs font-medium text-gray-darkest hover:border-accent-warm disabled:opacity-60 transition-colors"
          >
            Save text
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onRegenerate}
            className="rounded-md border border-gray-lighter px-3 py-2 text-xs font-medium text-gray-darkest hover:border-accent-warm disabled:opacity-60 transition-colors"
          >
            Regenerate (Claude)
          </button>
          <button
            type="button"
            disabled={busy || review.status === "approved"}
            onClick={onApprove}
            className="rounded-md bg-accent-warm px-3 py-2 text-xs font-medium text-gray-darkest hover:bg-accent-warm-light disabled:opacity-60 transition-colors"
          >
            Approve
          </button>
        </div>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={10}
        className="w-full rounded-md border border-gray-lighter bg-white px-3 py-2 text-sm text-gray-darkest outline-none focus:border-accent-warm font-body leading-relaxed"
      />
    </div>
  );
}
