"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type AdminCategory } from "@/lib/admin-data";
import { useAdminCategories, upsertCategory, deleteCategory } from "@/lib/admin-store";
import { toast } from "sonner";

function CategoryDialog({ category, trigger }: { category?: AdminCategory; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const editing = !!category;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90"><Plus className="mr-2 h-4 w-4" /> New category</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display text-2xl">{editing ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const name = String(f.get("name") || "Category");
            upsertCategory({
              id: category?.id ?? `CAT-${Date.now()}`,
              name,
              slug: String(f.get("slug") || name.toLowerCase().replace(/\s+/g, "-")),
              products: category?.products ?? 0,
              image: String(f.get("image") || category?.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80"),
              status: String(f.get("status") || "Active") as AdminCategory["status"],
            });
            toast.success(editing ? "Category updated" : "Category created");
            setOpen(false);
          }}
        >
          <div className="space-y-2"><Label>Name</Label><Input name="name" required defaultValue={category?.name} /></div>
          <div className="space-y-2"><Label>Slug</Label><Input name="slug" defaultValue={category?.slug} placeholder="auto from name" /></div>
          <div className="space-y-2"><Label>Image URL</Label><Input name="image" defaultValue={category?.image} /></div>
          <div className="space-y-2"><Label>Status</Label>
            <Select name="status" defaultValue={category?.status ?? "Active"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Hidden">Hidden</SelectItem></SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90">{editing ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function PageClient() {
    const rows = useAdminCategories();
    return (
      <AdminShell title="Categories" breadcrumbs={[{ label: "Categories" }]}
        actions={<CategoryDialog />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <div key={c.id} className="group overflow-hidden border border-border/60 bg-card">
              <div className="relative h-40 overflow-hidden">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <Badge className="absolute right-3 top-3">{c.status}</Badge>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-lg">{c.name}</div>
                    <div className="text-xs text-muted-foreground">/{c.slug} · {c.products} products</div>
                  </div>
                  <div className="flex gap-1">
                    <CategoryDialog category={c} trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>} />
                    <Button size="icon" variant="ghost" onClick={() => { deleteCategory(c.id); toast.success("Category removed"); }}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }
