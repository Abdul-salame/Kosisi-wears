"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Trash2, Pencil, Filter } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency, type AdminProduct } from "@/lib/admin-data";
import { useAdminProducts, upsertProduct, deleteProducts, setProductsStatus } from "@/lib/admin-store";
import { toast } from "sonner";

export function PageClient() {
  const rows = useAdminProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const perPage = 8;

  const filtered = useMemo(() => {
    let r = rows.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));
    if (cat !== "all") r = r.filter((p) => p.category === cat);
    if (status !== "all") r = r.filter((p) => p.status === status);
    r = [...r].sort((a, b) => {
      if (sort === "price") return b.price - a.price;
      if (sort === "stock") return a.stock - b.stock;
      if (sort === "sold") return b.sold - a.sold;
      return a.name.localeCompare(b.name);
    });
    return r;
  }, [rows, q, cat, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const cats = Array.from(new Set(rows.map((r) => r.category)));

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () => setSelected(selected.length === paged.length ? [] : paged.map((p) => p.id));

  return (
    <AdminShell
      title="Products"
      breadcrumbs={[{ label: "Products" }]}
      actions={<ProductDialog />}
    >
      <div className="border border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/40 p-4">
          <div className="relative flex-1 min-w-55">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products or SKU…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40"><Filter className="mr-2 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price (high)</SelectItem>
              <SelectItem value="stock">Stock (low)</SelectItem>
              <SelectItem value="sold">Bestselling</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center justify-between border-b border-border/40 bg-gold/5 px-4 py-2 text-sm">
            <span>{selected.length} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setProductsStatus(selected, "Archived"); toast.success(`${selected.length} products archived`); setSelected([]); }}>Archive</Button>
              <Button size="sm" variant="outline" onClick={() => { setProductsStatus(selected, "Active"); toast.success(`${selected.length} products activated`); setSelected([]); }}>Activate</Button>
              <Button size="sm" variant="destructive" onClick={() => { deleteProducts(selected); toast.success("Deleted"); setSelected([]); }}>Delete</Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"><Checkbox checked={paged.length > 0 && selected.length === paged.length} onCheckedChange={toggleAll} /></TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((p) => (
              <TableRow key={p.id}>
                <TableCell><Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggle(p.id)} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 object-cover" />
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.colors.join(" · ")}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
                <TableCell className={`text-right ${p.stock < 10 ? "text-red-400" : p.stock < 30 ? "text-amber-400" : ""}`}>{p.stock}</TableCell>
                <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <ProductDialog
                      product={p}
                      trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-red-400" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {p.name}?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently remove the product from your catalog.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { deleteProducts([p.id]); toast.success("Product deleted"); }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-border/40 p-4 text-sm">
          <div className="text-muted-foreground">Showing {paged.length} of {filtered.length}</div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="px-3 py-1.5 text-muted-foreground">Page {page} of {pageCount}</span>
            <Button size="sm" variant="outline" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function ProductDialog({ product, trigger }: { product?: AdminProduct; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>(product?.image ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editing = !!product;

  useEffect(() => {
    if (!open) return;
    setImageDataUrl(product?.image ?? "");
  }, [product, open]);

  const onImagePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90"><Plus className="mr-2 h-4 w-4" /> New product</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle className="font-display text-2xl">{editing ? "Edit product" : "Create product"}</DialogTitle></DialogHeader>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            upsertProduct({
              id: product?.id ?? `PRD-${Date.now()}`,
              name: String(f.get("name") || "New product"),
              sku: product?.sku ?? `KW-${Math.floor(Math.random() * 9000 + 1000)}`,
              category: String(f.get("category") || "Hoodies"),
              price: Number(f.get("price") || 100),
              discount: Number(f.get("discount") || 0),
              stock: Number(f.get("stock") || 0),
              sizes: String(f.get("sizes") || "S, M, L").split(",").map((s) => s.trim()).filter(Boolean),
              colors: product?.colors ?? ["Onyx"],
              image: String(f.get("image") || product?.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80"),
              status: String(f.get("status") || "Active") as AdminProduct["status"],
              sold: product?.sold ?? 0,
            });
            toast.success(editing ? "Product updated" : "Product created");
            setOpen(false);
          }}
        >
          <div className="md:col-span-2 space-y-2"><Label>Product name</Label><Input name="name" required defaultValue={product?.name} /></div>
          <div className="space-y-2"><Label>Category</Label>
            <Select name="category" defaultValue={product?.category ?? "Hoodies"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Hoodies","Sweatshirts","Varsity Jackets","Uniforms","Kaftans","Caps"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Status</Label>
            <Select name="status" defaultValue={product?.status ?? "Active"}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Archived">Archived</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Price</Label><Input name="price" type="number" defaultValue={product?.price ?? 150} /></div>
          <div className="space-y-2"><Label>Discount (%)</Label><Input name="discount" type="number" defaultValue={product?.discount ?? 0} /></div>
          <div className="space-y-2"><Label>Stock</Label><Input name="stock" type="number" defaultValue={product?.stock ?? 50} /></div>
          <div className="space-y-2"><Label>Sizes</Label><Input name="sizes" defaultValue={(product?.sizes ?? ["S","M","L","XL"]).join(", ")} /></div>
          <div className="md:col-span-2 space-y-2"><Label>Description</Label><Textarea name="description" rows={3} defaultValue="Cut from premium heavyweight fabric with signature gold detailing." /></div>
          <div className="md:col-span-2 space-y-2">
            <Label>Product image</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Select image</Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImagePick}
                />
              </div>
              {imageDataUrl ? (
                <div className="h-24 w-24 overflow-hidden rounded border border-border bg-muted">
                  <img src={imageDataUrl} alt="Product preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-24 w-24 rounded border border-dashed border-border/70 bg-muted/50 text-center text-xs text-muted-foreground flex items-center justify-center">
                  No image selected
                </div>
              )}
            </div>
          </div>
          <input type="hidden" name="image" value={imageDataUrl} />
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90">{editing ? "Save changes" : "Create product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}