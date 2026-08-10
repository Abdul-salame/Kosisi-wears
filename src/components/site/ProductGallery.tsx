"use client";

import { useState, type MouseEvent } from "react";
import { Expand, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [full, setFull] = useState(false);

  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const step = (d: number) => setActive((i) => (i + d + images.length) % images.length);

  return (
    <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={cn("aspect-[4/5] w-16 shrink-0 overflow-hidden border-2 sm:w-full", active === i ? "border-gold" : "border-transparent hover:border-border")}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="relative order-1 sm:order-2">
        <div
          className="aspect-[4/5] cursor-zoom-in overflow-hidden bg-secondary"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={move}
          onClick={() => setFull(true)}
        >
          <img
            src={images[active]}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300"
            style={{ transform: zoom ? "scale(1.9)" : "scale(1)", transformOrigin: origin }}
          />
        </div>

        <button onClick={() => step(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 hover:bg-background">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => step(1)} aria-label="Next image" className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 hover:bg-background">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button onClick={() => setFull(true)} aria-label="Open fullscreen viewer" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 hover:bg-background">
          <Expand className="h-4 w-4" />
        </button>
        <p className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-background/85 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <ZoomIn className="h-3 w-3" /> Hover to zoom
        </p>
      </div>

      <Dialog open={full} onOpenChange={setFull}>
        <DialogContent className="max-w-5xl border-0 bg-background p-0">
          <DialogTitle className="sr-only">{alt} gallery</DialogTitle>
          <div className="relative">
            <img src={images[active]} alt={alt} className="max-h-[80vh] w-full object-contain" />
            <button onClick={() => step(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => step(1)} aria-label="Next image" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="flex justify-center gap-2 pb-6">
            {images.map((src, i) => (
              <button key={i} onClick={() => setActive(i)} className={cn("h-14 w-12 overflow-hidden border-2", active === i ? "border-gold" : "border-transparent")}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
