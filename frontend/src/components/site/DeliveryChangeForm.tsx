"use client";

import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon, Truck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  date: z.date({ required_error: "Choose a preferred delivery date" }),
  instructions: z
    .string()
    .trim()
    .max(500, { message: "Instructions must be less than 500 characters" }),
});

export function DeliveryChangeForm({ orderId }: { orderId: string }) {
  const [date, setDate] = useState<Date | undefined>();
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<{ date?: string; instructions?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ date, instructions });
    if (!result.success) {
      const f = result.error.flatten().fieldErrors;
      setErrors({ date: f.date?.[0], instructions: f.instructions?.[0] });
      return;
    }
    setErrors({});
    setSubmitted(true);
    toast.success("Delivery change requested", {
      description: `We'll confirm ${format(result.data.date, "EEE, MMM d")} for order ${orderId} by email.`,
    });
  };

  if (submitted) {
    return (
      <div className="border-t border-border p-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Request received</p>
        <h2 className="mt-2 font-display text-2xl">We're on it.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Our concierge will confirm {date ? format(date, "EEEE, d MMMM yyyy") : "your preferred date"} with the courier
          and email you shortly.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs uppercase tracking-[0.2em] underline hover:text-gold"
          >
            Edit request
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setDate(undefined);
              setInstructions("");
              setErrors({});
              toast.success("Delivery change request cancelled", {
                description: `Order ${orderId} will arrive on its original schedule.`,
              });
            }}
            className="text-xs uppercase tracking-[0.2em] text-destructive underline hover:opacity-80"
          >
            Cancel request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-t border-border p-6">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-gold" />
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Request delivery change</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Prefer a different day, or need the courier to know something? Tell us and we'll arrange it.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="delivery-date" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Preferred delivery date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="delivery-date"
                type="button"
                variant="outline"
                className={cn(
                  "mt-2 h-12 w-full justify-start rounded-none text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "EEEE, d MMMM yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="mt-2 text-xs text-destructive">{errors.date}</p>}
        </div>

        <div>
          <Label htmlFor="delivery-instructions" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Delivery instructions
          </Label>
          <Textarea
            id="delivery-instructions"
            value={instructions}
            maxLength={500}
            rows={4}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Leave with the concierge, call on arrival"
            className="mt-2 rounded-none"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span className="text-destructive">{errors.instructions ?? ""}</span>
            <span>{instructions.length}/500</span>
          </div>
        </div>
      </div>

      <Button type="submit" className="mt-6 h-12 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">
        Submit request
      </Button>
    </form>
  );
}