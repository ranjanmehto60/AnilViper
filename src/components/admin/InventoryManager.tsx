"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Boxes, Check, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { InventoryItem } from "@/types/inventory";

type InventoryDraft = { quantity: number; reorderLevel: number };

function statusFor(item: InventoryItem) {
  if (item.quantity === 0) return { label: "Out of stock", className: "text-slate-300 bg-slate-950/60 border-slate-700" };
  if (item.quantity <= item.reorderLevel) return { label: "Low stock", className: "text-blue-200 bg-blue-950/40 border-blue-800" };
  return { label: "In stock", className: "text-white bg-slate-800 border-slate-700" };
}

export function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [drafts, setDrafts] = useState<Record<number, InventoryDraft>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [newSize, setNewSize] = useState(170);
  const [newQuantity, setNewQuantity] = useState(0);
  const [newReorderLevel, setNewReorderLevel] = useState(3);

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load products");
      const loadedProducts = data.products as Product[];
      setProducts(loadedProducts);
      setSelectedProductId((current) => {
        if (current && loadedProducts.some((product) => product.id === current)) return current;
        return loadedProducts[0]?.id ?? "";
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load products");
    }
  }, []);

  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/inventory", {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load inventory");
      const loadedItems = data.items as InventoryItem[];
      setItems(loadedItems);
      setDrafts(
        Object.fromEntries(
          loadedItems.map((item) => [item.id, { quantity: item.quantity, reorderLevel: item.reorderLevel }])
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load inventory");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    const firstSize = selectedProduct?.availableSizes[0];
    if (firstSize !== undefined) setNewSize(firstSize);
  }, [selectedProductId, selectedProduct]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) => item.productName.toLowerCase().includes(query) || String(item.size).includes(query)
    );
  }, [items, searchQuery]);

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = items.filter((item) => item.quantity <= item.reorderLevel).length;
  const outOfStockCount = items.filter((item) => item.quantity === 0).length;

  const updateDraft = (id: number, field: keyof InventoryDraft, value: number) => {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  };

  const saveItem = async (item: InventoryItem) => {
    const draft = drafts[item.id];
    if (!draft) return;
    setSavingId(item.id);
    try {
      const response = await fetch(`/api/admin/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save stock");
      setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? data.item : currentItem)));
      toast.success(`Updated ${item.productName} · ${item.size} cm`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save stock");
    } finally {
      setSavingId(null);
    }
  };

  const addItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProduct) return;
    setIsAdding(true);
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          size: newSize,
          quantity: newQuantity,
          reorderLevel: newReorderLevel,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to add stock record");
      setItems((current) => [...current, data.item].sort((a, b) =>
        a.productName.localeCompare(b.productName) || a.size - b.size
      ));
      setDrafts((current) => ({
        ...current,
        [data.item.id]: { quantity: data.item.quantity, reorderLevel: data.item.reorderLevel },
      }));
      setNewQuantity(0);
      toast.success("Inventory size added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add stock record");
    } finally {
      setIsAdding(false);
    }
  };

  const removeItem = async (item: InventoryItem) => {
    if (!window.confirm(`Remove ${item.productName} · ${item.size} cm from inventory?`)) return;
    try {
      const response = await fetch(`/api/admin/inventory/${item.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove inventory record");
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      toast.success("Inventory size removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove inventory record");
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 text-foreground">
      <div className="container mx-auto space-y-8 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Button asChild variant="ghost" size="icon" aria-label="Back to admin dashboard" className="mt-1">
              <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <div className="mb-1 flex items-center gap-2 text-accent">
                <Boxes className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Operations</span>
              </div>
              <h1 className="bebas-font text-4xl tracking-wide sm:text-5xl">Inventory Management</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Track dress quantities by height size and keep reorder points visible for every uniform.
              </p>
            </div>
          </div>
          <Badge variant="wtApproved" className="w-fit gap-1.5 px-3 py-1.5">
            <Check className="h-3.5 w-3.5" /> Database connected
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Tracked sizes", items.length, "Unique product / size rows"],
            ["Total units", totalUnits, "Across all dress sizes"],
            ["Low stock", lowStockCount, "At or below reorder point"],
            ["Out of stock", outOfStockCount, "Needs immediate restock"],
          ].map(([label, value, helper]) => (
            <div key={String(label)} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-wider text-muted">{label}</p>
              <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
              <p className="mt-1 text-xs text-subtle">{helper}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider">Current stock</h2>
                <p className="mt-1 text-xs text-muted">Edit units and reorder thresholds, then save the row.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-subtle" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search uniform or size"
                  className="h-10 pl-9 text-xs"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-muted">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading database inventory…
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center text-sm text-muted">
                No inventory rows match this search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="border-b border-border bg-surface-2 text-[10px] font-black uppercase tracking-wider text-muted">
                    <tr>
                      <th className="p-3">Dress / size</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Units on hand</th>
                      <th className="p-3">Reorder at</th>
                      <th className="p-3">Updated</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.map((item) => {
                      const draft = drafts[item.id] ?? { quantity: item.quantity, reorderLevel: item.reorderLevel };
                      const status = statusFor({ ...item, ...draft });
                      return (
                        <tr key={item.id} className="hover:bg-surface-2/60">
                          <td className="p-3">
                            <p className="max-w-[260px] font-bold text-foreground">{item.productName}</p>
                            <p className="mt-1 font-mono text-[11px] text-accent">{item.size} cm</p>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${status.className}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min={0}
                              value={draft.quantity}
                              onChange={(event) => updateDraft(item.id, "quantity", Number(event.target.value))}
                              className="h-9 w-24 text-xs font-bold"
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min={0}
                              value={draft.reorderLevel}
                              onChange={(event) => updateDraft(item.id, "reorderLevel", Number(event.target.value))}
                              className="h-9 w-24 text-xs font-bold"
                            />
                          </td>
                          <td className="p-3 whitespace-nowrap text-muted">
                            {new Date(item.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                onClick={() => saveItem(item)}
                                disabled={savingId === item.id}
                                className="h-9 px-3 text-[10px]"
                              >
                                {savingId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => removeItem(item)} aria-label={`Remove ${item.productName} size ${item.size}`} className="h-9 w-9 text-danger hover:bg-danger/10">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="h-fit rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-black uppercase tracking-wider">Add size stock</h2>
                <p className="mt-1 text-xs text-muted">Create a new product / size row.</p>
              </div>
            </div>
            <form onSubmit={addItem} className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-black uppercase text-muted">Dress</span>
                <select
                  value={selectedProductId}
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-xs text-foreground outline-none focus:border-accent/60"
                >
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-muted">Size (cm)</span>
                  <select
                    value={newSize}
                    onChange={(event) => setNewSize(Number(event.target.value))}
                    className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-xs text-foreground outline-none focus:border-accent/60"
                  >
                    {selectedProduct?.availableSizes.map((size) => <option key={size} value={size}>{size} cm</option>)}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-muted">Opening units</span>
                  <Input type="number" min={0} value={newQuantity} onChange={(event) => setNewQuantity(Number(event.target.value))} />
                </label>
              </div>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-black uppercase text-muted">Reorder when at</span>
                <Input type="number" min={0} value={newReorderLevel} onChange={(event) => setNewReorderLevel(Number(event.target.value))} />
              </label>
              <Button type="submit" disabled={isAdding || !selectedProduct} className="w-full text-xs font-black uppercase">
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add inventory row
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
