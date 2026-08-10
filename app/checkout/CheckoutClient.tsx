"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Check, CreditCard, Truck, MapPin, User, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { formatPrice, useStore } from "@/lib/store";
import { CouponField } from "@/components/site/CouponField";
import { useDiscount, removeCoupon } from "@/lib/coupon";
import { products } from "@/lib/products";
import { savePlacedOrder, newOrderId, type PaymentMethod } from "@/lib/placed-orders";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Shipping", "Delivery", "Payment", "Review"] as const;

const DELIVERY_OPTIONS = [
  { v: "standard", t: "Standard · 3–5 days", fee: 15 },
  { v: "express", t: "Express · 1–2 days", fee: 35 },
  { v: "pickup", t: "Atelier pickup · Lagos", fee: 0 },
] as const;

const shippingSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  firstName: z.string().trim().min(2, "First name is required").max(60),
  lastName: z.string().trim().min(2, "Last name is required").max(60),
  address: z.string().trim().min(5, "Enter your full street address").max(160),
  city: z.string().trim().min(2, "City is required").max(80),
  postal: z.string().trim().min(3, "Postal code is required").max(12),
  country: z.string().trim().min(2, "Country is required").max(80),
  state: z.string().trim().max(80).optional().or(z.literal("")),
});

const cardSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .refine((v) => /^\d{16}$/.test(v.replace(/\s/g, "")), "Enter a valid 16-digit card number"),
  expiry: z
    .string()
    .trim()
    .refine((v) => /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(v), "Use MM / YY"),
  cvc: z.string().trim().refine((v) => /^\d{3,4}$/.test(v), "3 or 4 digits"),
  cardName: z.string().trim().min(2, "Name on card is required").max(80),
});

type Errors = Record<string, string>;

const emptyShipping = {
  email: "", phone: "", firstName: "", lastName: "",
  address: "", city: "", postal: "", country: "Nigeria", state: "",
};
const emptyCard = { cardNumber: "", expiry: "", cvc: "", cardName: "" };

function Field({
  label, value, onChange, error, ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) {
  const id = label.replace(/[^a-zA-Z]+/g, "-").toLowerCase();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className={cn("rounded-none mt-2", error && "border-destructive focus-visible:ring-destructive")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutClient() {
  const { cart, subtotal, clearCart } = useStore();
  const { coupon, discount } = useDiscount(subtotal);
  const [step, setStep] = useState(0);
  const [isGuest, setIsGuest] = useState(true);
  const [delivery, setDelivery] = useState<string>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [ship, setShip] = useState(emptyShipping);
  const [card, setCard] = useState(emptyCard);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const router = useRouter();

  const freeShipping = subtotal > 250;
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.v === delivery)!;
  const deliveryFee =
    deliveryOption.v === "standard" && freeShipping ? 0 : deliveryOption.fee;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const setShipField = (k: keyof typeof emptyShipping) => (v: string) => {
    setShip((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };
  const setCardField = (k: keyof typeof emptyCard) => (v: string) => {
    setCard((c) => ({ ...c, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateStep = (s: number): boolean => {
    if (s === 0) {
      const r = shippingSchema.safeParse(ship);
      if (!r.success) {
        const next: Errors = {};
        for (const issue of r.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next);
        toast.error("Please complete the highlighted fields");
        return false;
      }
    }
    if (s === 2 && payment === "card") {
      const r = cardSchema.safeParse(card);
      if (!r.success) {
        const next: Errors = {};
        for (const issue of r.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next);
        toast.error("Check your card details");
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const next = () => { if (validateStep(step)) setStep((s) => Math.min(STEPS.length - 1, s + 1)); };
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const goToStep = (i: number) => {
    if (i <= step) { setStep(i); return; }
    for (let s = step; s < i; s++) if (!validateStep(s)) { setStep(s); return; }
    setStep(i);
  };

  const placeOrder = () => {
    if (!validateStep(0) ) { setStep(0); return; }
    if (!validateStep(2)) { setStep(2); return; }
    setPlacing(true);
    const id = newOrderId();
    savePlacedOrder({
      id,
      placedAt: new Date().toISOString(),
      email: ship.email,
      name: `${ship.firstName} ${ship.lastName}`.trim(),
      phone: ship.phone || undefined,
      address: ship.address,
      city: ship.city,
      postal: ship.postal,
      state: ship.state || undefined,
      country: ship.country,
      delivery,
      deliveryLabel: deliveryOption.t,
      deliveryFee,
      payment,
      cardLast4: payment === "card" ? card.cardNumber.replace(/\s/g, "").slice(-4) : undefined,
      couponCode: coupon?.code,
      items: cart.flatMap((item) => {
        const p = products.find((x) => x.id === item.productId);
        if (!p) return [];
        return [{
          productId: p.id, name: p.name, image: p.images[0],
          size: item.size, color: item.color, qty: item.qty, price: p.price,
        }];
      }),
      subtotal,
      discount,
      total: grandTotal,
    });
    // Simulate the provider hand-off before landing on the confirmation page.
    setTimeout(() => {
      clearCart();
      removeCoupon();
      router.push(`/checkout/success?order=${id}`);
    }, 700);
  };

  if (cart.length === 0) {
    return (
      <div className="container-luxury py-24 text-center">
        <h1 className="font-display text-3xl">Your bag is empty.</h1>
        <Button asChild className="mt-6 rounded-none"><Link href="/shop">Shop the Collection</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-luxury py-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Checkout</p>
      <h1 className="font-display text-4xl sm:text-5xl mt-2">Complete your order</h1>

      {/* Stepper */}
      <ol className="mt-8 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => goToStep(i)}
              className="flex w-full items-center gap-3 text-left"
            >
              <span className={cn("h-8 w-8 shrink-0 rounded-full border grid place-items-center text-xs", i <= step ? "bg-gold border-gold text-gold-foreground" : "border-border text-muted-foreground")}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-[11px] uppercase tracking-[0.2em] hidden sm:inline", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-8">
          {step === 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl flex items-center gap-2"><MapPin className="h-5 w-5 text-gold" /> Shipping</h2>
                <div className="flex text-[11px] uppercase tracking-[0.2em] border border-border">
                  <button onClick={() => setIsGuest(true)} className={cn("px-4 py-2", isGuest && "bg-primary text-primary-foreground")}>Guest</button>
                  <button onClick={() => setIsGuest(false)} className={cn("px-4 py-2", !isGuest && "bg-primary text-primary-foreground")}>Login</button>
                </div>
              </div>
              {!isGuest ? (
                <div className="space-y-4 max-w-md">
                  <p className="text-sm text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> Sign in to autofill your details.</p>
                  <Field label="Email" type="email" placeholder="you@kosisi.co" value={ship.email} onChange={setShipField("email")} error={errors.email} />
                  <div><Label>Password</Label><Input className="rounded-none mt-2" type="password" placeholder="••••••••" /></div>
                  <Button
                    className="rounded-none"
                    onClick={() => {
                      const ok = z.string().email().safeParse(ship.email).success;
                      if (!ok) { setErrors({ email: "Enter a valid email" }); return; }
                      setIsGuest(true);
                      toast.success("Signed in", { description: "Continue with your shipping details." });
                    }}
                  >Sign In</Button>
                  <p className="text-xs text-muted-foreground">or <button onClick={() => setIsGuest(true)} className="underline">continue as guest</button></p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email *" type="email" value={ship.email} onChange={setShipField("email")} error={errors.email} />
                  <Field label="Phone" type="tel" value={ship.phone} onChange={setShipField("phone")} error={errors.phone} />
                  <Field label="First name *" value={ship.firstName} onChange={setShipField("firstName")} error={errors.firstName} />
                  <Field label="Last name *" value={ship.lastName} onChange={setShipField("lastName")} error={errors.lastName} />
                  <div className="sm:col-span-2">
                    <Field label="Address *" value={ship.address} onChange={setShipField("address")} error={errors.address} />
                  </div>
                  <Field label="City *" value={ship.city} onChange={setShipField("city")} error={errors.city} />
                  <Field label="Postal code *" value={ship.postal} onChange={setShipField("postal")} error={errors.postal} />
                  <Field label="Country *" value={ship.country} onChange={setShipField("country")} error={errors.country} />
                  <Field label="State" value={ship.state} onChange={setShipField("state")} error={errors.state} />
                </div>
              )}
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="font-display text-2xl mb-6 flex items-center gap-2"><Truck className="h-5 w-5 text-gold" /> Delivery method</h2>
              <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-3">
                {DELIVERY_OPTIONS.map(o => {
                  const fee = o.v === "standard" && freeShipping ? 0 : o.fee;
                  return (
                    <label key={o.v} className={cn("flex items-center justify-between border p-5 cursor-pointer", delivery === o.v ? "border-gold" : "border-border")}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={o.v} />
                        <span className="text-sm">{o.t}</span>
                      </div>
                      <span className="font-display">{fee === 0 ? "Free" : formatPrice(fee)}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="font-display text-2xl mb-6 flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /> Payment</h2>
              <RadioGroup value={payment} onValueChange={(v) => { setPayment(v as PaymentMethod); setErrors({}); }} className="grid sm:grid-cols-3 gap-3">
                {[
                  { v: "card", t: "Card" },
                  { v: "paystack", t: "Paystack" },
                  { v: "flutterwave", t: "Flutterwave" },
                ].map(o => (
                  <label key={o.v} className={cn("border p-5 text-center cursor-pointer", payment === o.v ? "border-gold text-gold" : "border-border")}>
                    <RadioGroupItem value={o.v} className="sr-only" />
                    <div className="text-[11px] uppercase tracking-[0.2em] font-semibold">{o.t}</div>
                  </label>
                ))}
              </RadioGroup>
              {payment === "card" && (
                <div className="mt-6 space-y-4 max-w-md">
                  <Field label="Card number" inputMode="numeric" maxLength={19} placeholder="1234 5678 9012 3456" value={card.cardNumber} onChange={setCardField("cardNumber")} error={errors.cardNumber} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" placeholder="MM / YY" maxLength={7} value={card.expiry} onChange={setCardField("expiry")} error={errors.expiry} />
                    <Field label="CVC" inputMode="numeric" maxLength={4} placeholder="123" value={card.cvc} onChange={setCardField("cvc")} error={errors.cvc} />
                  </div>
                  <Field label="Name on card" value={card.cardName} onChange={setCardField("cardName")} error={errors.cardName} />
                </div>
              )}
              {payment !== "card" && (
                <div className="mt-6 border border-dashed border-border p-6 text-sm text-muted-foreground">
                  You'll be redirected to <strong className="text-foreground">{payment === "paystack" ? "Paystack" : "Flutterwave"}</strong> to complete payment securely.
                </div>
              )}
              <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Encrypted and PCI-DSS compliant.</p>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="font-display text-2xl mb-6">Review your order</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border p-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Ship to</p>
                  <p className="mt-2 text-sm">{ship.firstName} {ship.lastName}</p>
                  <p className="text-sm text-muted-foreground">{ship.address}, {ship.city} {ship.postal}</p>
                  <p className="text-sm text-muted-foreground">{ship.state ? `${ship.state}, ` : ""}{ship.country}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{ship.email}{ship.phone ? ` · ${ship.phone}` : ""}</p>
                  <button onClick={() => setStep(0)} className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold">Edit</button>
                </div>
                <div className="border border-border p-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Delivery &amp; payment</p>
                  <p className="mt-2 text-sm">{deliveryOption.t}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {payment === "card" ? `Card ending ${card.cardNumber.replace(/\s/g, "").slice(-4)}` : payment}
                  </p>
                  <button onClick={() => setStep(1)} className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold">Edit</button>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {cart.map(item => {
                  const p = products.find(x => x.id === item.productId);
                  if (!p) return null;
                  return (
                    <div key={item.id} className="flex gap-4 border-b border-border pb-4">
                      <img src={p.images[0]} alt="" className="h-20 w-16 object-cover bg-secondary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Size {item.size} · {item.color} · Qty {item.qty}</p>
                      </div>
                      <span className="text-sm">{formatPrice(p.price * item.qty)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-sm text-muted-foreground">By placing this order you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</div>
            </section>
          )}

          <div className="flex justify-between pt-6 border-t border-border">
            <Button variant="outline" className="rounded-none" onClick={prev} disabled={step === 0}>← Back</Button>
            {step < STEPS.length - 1 ? (
              <Button className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em]" onClick={next}>Continue</Button>
            ) : (
              <Button disabled={placing} className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em] bg-gold hover:bg-gold/90 text-gold-foreground" onClick={placeOrder}>
                {placing ? "Processing…" : `Place Order · ${formatPrice(grandTotal)}`}
              </Button>
            )}
          </div>
        </div>

        <aside className="bg-secondary/50 border border-border p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl">Order Summary</h2>
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {cart.map(item => {
              const p = products.find(x => x.id === item.productId);
              if (!p) return null;
              return (
                <div key={item.id} className="flex gap-3">
                  <img src={p.images[0]} alt="" className="h-14 w-11 object-cover bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.size} · {item.color} · x{item.qty}</p>
                  </div>
                  <span className="text-xs">{formatPrice(p.price * item.qty)}</span>
                </div>
              );
            })}
          </div>
          <dl className="mt-4 space-y-2 pt-4 border-t border-border text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && (
              <div className="flex justify-between text-gold"><dt>Discount</dt><dd>−{formatPrice(discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</dd></div>
            <div className="flex justify-between pt-3 border-t border-border font-display text-lg"><dt>Total</dt><dd>{formatPrice(grandTotal)}</dd></div>
          </dl>
          <CouponField subtotal={subtotal} />
        </aside>
      </div>
    </div>
  );
}
