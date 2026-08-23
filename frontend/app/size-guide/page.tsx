import type { Metadata } from "next";
import { Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "Size Guide — Kosisi Wears",
  description: "Kosisi Wears size guide: chest, waist, length and sleeve measurements for jerseys, hoodies, jackets, tees and caps, plus how to measure yourself.",
};

const TOPS = [
  { size: "XS", chest: "86–91", waist: "71–76", length: "66", sleeve: "60" },
  { size: "S", chest: "91–97", waist: "76–81", length: "68", sleeve: "61.5" },
  { size: "M", chest: "97–102", waist: "81–86", length: "70", sleeve: "63" },
  { size: "L", chest: "102–107", waist: "86–91", length: "72", sleeve: "64.5" },
  { size: "XL", chest: "107–112", waist: "91–97", length: "74", sleeve: "66" },
  { size: "XXL", chest: "112–120", waist: "97–104", length: "76", sleeve: "67.5" },
];

export default function Page() {
  return (
    <div className="container-luxury max-w-4xl py-16">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Fit</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Size Guide</h1>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        All measurements are in centimetres and taken flat, on the body. Our jerseys and hoodies are cut with a relaxed shoulder — size down for a fitted look.
      </p>

      <div className="mt-10 overflow-x-auto border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-secondary/50 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              {["Size", "Chest", "Waist", "Body length", "Sleeve"].map((h) => <th key={h} className="p-4 text-left font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {TOPS.map((r) => (
              <tr key={r.size} className="border-t border-border">
                <td className="p-4 font-display text-lg">{r.size}</td>
                <td className="p-4">{r.chest}</td>
                <td className="p-4">{r.waist}</td>
                <td className="p-4">{r.length}</td>
                <td className="p-4">{r.sleeve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {[
          { t: "Chest", d: "Measure around the fullest part of your chest, keeping the tape level under your arms." },
          { t: "Waist", d: "Measure around your natural waistline, just above the hip bone, without pulling tight." },
          { t: "Body length", d: "From the highest point of the shoulder straight down to the hem." },
          { t: "Caps", d: "One size, adjustable strap — fits 55–61cm head circumference." },
        ].map((x) => (
          <div key={x.t} className="border border-border p-6">
            <Ruler className="h-5 w-5 text-gold" />
            <h2 className="mt-3 font-display text-xl">{x.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
