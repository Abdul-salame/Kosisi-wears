import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Kosisi Wears",
  description: "The Kosisi story: a Lagos-born atelier crafting luxury sportswear in limited runs, founded on quiet luxury and honest craft.",
};

import { Sparkles, Target, Eye, HeartHandshake } from "lucide-react";

const TEAM = [
  { name: "Kelechi Adeyemi", role: "Founder & Creative Director", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80" },
  { name: "Zainab Bello", role: "Head of Atelier", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" },
  { name: "Marcus Owens", role: "Design Lead", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
  { name: "Ada Nkem", role: "Client Experience", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
];

export default function Page() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src="/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container-luxury h-full flex flex-col justify-center text-white">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl max-w-2xl">Craft, quietly.</h1>
          <p className="mt-6 max-w-xl text-white/70">Founded in Lagos, 2019. A luxury sportswear atelier building pieces the way they used to — by hand, in small runs, with intention.</p>
        </div>
      </section>

      <section className="container-luxury py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Brand Story</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-3">A quieter kind of luxury.</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>Kosisi began with a single hoodie — cut heavier, finished cleaner, and stitched by hand in a Lagos studio no bigger than an apartment. What started as a personal frustration with disposable luxury has become a small, insistent atelier making pieces that outlive trends.</p>
            <p>We keep runs small, our materials heavy, and our finishing entirely human. Every piece carries a serial and the mark of the maker.</p>
          </div>
        </div>
        <div className="aspect-[4/5] overflow-hidden"><img src="/lookbook.jpg" alt="" className="h-full w-full object-cover" /></div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="container-luxury grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Mission", body: "Prove that luxury sportswear can be honest, durable and made without compromise." },
            { icon: Eye, title: "Vision", body: "To become the most collected atelier of the next decade — quietly, and on our own terms." },
            { icon: HeartHandshake, title: "Values", body: "Craft over quantity. Honesty over hype. Longevity over trend. Care in every stitch." },
          ].map((v, i) => (
            <div key={i} className="bg-background border border-border p-8">
              <div className="h-10 w-10 grid place-items-center border border-gold text-gold rounded-full"><v.icon className="h-5 w-5" /></div>
              <h3 className="font-display text-2xl mt-4">{v.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxury py-20">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Meet the team</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-3">The atelier.</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map(m => (
            <div key={m.name}>
              <div className="aspect-[4/5] overflow-hidden bg-secondary">
                <img src={m.img} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 font-display text-lg">{m.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxury pb-24">
        <div className="grid sm:grid-cols-4 gap-6 border-y border-border py-12">
          {[["7","Years crafting"],["18k","Pieces made"],["42","Countries shipped"],["<300","Per drop"]].map(([n,l],i) => (
            <div key={i} className="text-center">
              <p className="font-display text-4xl text-gold flex items-center justify-center gap-1"><Sparkles className="h-4 w-4" />{n}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">{l}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}