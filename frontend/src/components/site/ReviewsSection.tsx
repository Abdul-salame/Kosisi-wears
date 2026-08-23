"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Star, ImagePlus, X, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addReview, seedReviews, useCustomerReviews } from "@/lib/customer-reviews";
import { cn } from "@/lib/utils";

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(size, i <= Math.round(value) ? "fill-gold text-gold" : "text-muted-foreground")} />
      ))}
    </div>
  );
}

export function ReviewsSection({ productId, productName }: { productId: string; productName: string }) {
  const all = useCustomerReviews();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const reviews = useMemo(
    () => [...all.filter((r) => r.productId === productId), ...seedReviews(productId)],
    [all, productId],
  );
  const average = reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1);
  const breakdown = [5, 4, 3, 2, 1].map((s) => ({ s, n: reviews.filter((r) => r.rating === s).length }));

  const pickImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - images.length);
    files.forEach((f) => {
      if (f.size > 3_000_000) { toast.error("Images must be under 3MB"); return; }
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, String(reader.result)].slice(0, 3));
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (rating < 1) return toast.error("Please select a rating");
    if (!name.trim() || name.length > 60) return toast.error("Please enter your name");
    if (body.trim().length < 10) return toast.error("Tell us a little more (10+ characters)");
    addReview({
      productId,
      name: name.trim().slice(0, 60),
      rating,
      title: title.trim().slice(0, 100) || "Verified purchase",
      body: body.trim().slice(0, 1000),
      images,
    });
    toast.success("Thank you — your review is live");
    setOpen(false); setRating(0); setName(""); setTitle(""); setBody(""); setImages([]);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <div className="border border-border p-6 h-fit">
        <p className="font-display text-5xl">{average.toFixed(1)}</p>
        <Stars value={average} />
        <p className="mt-2 text-xs text-muted-foreground">Based on {reviews.length} reviews</p>
        <div className="mt-5 space-y-2">
          {breakdown.map(({ s, n }) => (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-muted-foreground">{s}★</span>
              <div className="h-1.5 flex-1 bg-secondary">
                <div className="h-full bg-gold" style={{ width: `${reviews.length ? (n / reviews.length) * 100 : 0}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{n}</span>
            </div>
          ))}
        </div>
        <Button onClick={() => setOpen((o) => !o)} className="mt-6 h-11 w-full rounded-none text-[11px] uppercase tracking-[0.2em]">
          <MessageSquarePlus className="mr-2 h-4 w-4" /> Write a review
        </Button>
      </div>

      <div>
        {open && (
          <form onSubmit={submit} className="mb-10 border border-gold/40 bg-gold/5 p-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Review {productName}</p>
            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" aria-label={`${i} star`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)}>
                  <Star className={cn("h-7 w-7 transition-colors", i <= (hover || rating) ? "fill-gold text-gold" : "text-muted-foreground")} />
                </button>
              ))}
              <span className="ml-2 text-xs text-muted-foreground">{rating ? `${rating} / 5` : "Select a rating"}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-11 rounded-none" />
              <Input value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} placeholder="Review title (optional)" className="h-11 rounded-none" />
            </div>
            <Textarea value={body} maxLength={1000} onChange={(e) => setBody(e.target.value)} placeholder="How does it fit? How does it feel?" className="mt-3 min-h-28 rounded-none" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {images.map((src, i) => (
                <div key={i} className="relative h-16 w-16">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setImages((p) => p.filter((_, x) => x !== i))} className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Remove image">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="grid h-16 w-16 cursor-pointer place-items-center border border-dashed border-border text-muted-foreground hover:border-gold hover:text-gold">
                  <ImagePlus className="h-5 w-5" />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={pickImages} />
                </label>
              )}
              <p className="text-xs text-muted-foreground">Add up to 3 photos (optional)</p>
            </div>
            <div className="mt-5 flex gap-3">
              <Button type="submit" className="h-11 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">Submit review</Button>
              <Button type="button" variant="outline" className="h-11 rounded-none px-6 text-[11px] uppercase tracking-[0.2em]" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-border pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <Stars value={r.rating} />
                <span className="text-sm font-medium">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
                <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-gold">Verified buyer</span>
              </div>
              <p className="mt-2 font-display text-lg">{r.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              {r.images.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {r.images.map((src, i) => <img key={i} src={src} alt="" className="h-20 w-20 object-cover" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
