"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { CategoryType, Product } from "@/types/product";

const CATEGORIES: CategoryType[] = [
  "Beginner Dobok",
  "Advanced Competition Dobok",
  "Kids Dobok",
  "Black Belt Dobok",
  "Belts & Accessories",
];

const ALL_SIZES = [110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

interface ProductFormProps {
  initial?: Product | null;
  submitLabel: string;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
}

export function ProductForm({ initial, submitLabel, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<CategoryType>(
    initial?.category ?? "Advanced Competition Dobok"
  );
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [originalPrice, setOriginalPrice] = useState(
    initial ? String(initial.originalPrice) : ""
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrls, setImageUrls] = useState(initial?.images.join("\n") ?? "");
  const [sizes, setSizes] = useState<number[]>(
    initial?.availableSizes ?? [140, 150, 160, 170, 180, 190, 200]
  );
  const [features, setFeatures] = useState(initial?.features.join("\n") ?? "");
  const [fabricSpecs, setFabricSpecs] = useState(initial?.fabricSpecs ?? "");
  const [weightGsm, setWeightGsm] = useState(String(initial?.weightGsm ?? 210));
  const [isWTApproved, setIsWTApproved] = useState(initial?.isWTApproved ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSize = (size: number) => {
    setSizes((current) =>
      current.includes(size) ? current.filter((s) => s !== size) : [...current, size]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const priceValue = Number(price);
    const originalPriceValue = Number(originalPrice || price);
    const images = imageUrls
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    if (!name.trim()) {
      toast.error("Please enter a uniform name.");
      return;
    }
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid selling price.");
      return;
    }
    if (!Number.isFinite(originalPriceValue) || originalPriceValue < priceValue) {
      toast.error("Original price must be at least the selling price.");
      return;
    }
    if (images.length === 0) {
      toast.error("Add at least one image URL (one per line).");
      return;
    }
    if (sizes.length === 0) {
      toast.error("Select at least one height size.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        price: priceValue,
        originalPrice: originalPriceValue,
        description: description.trim(),
        images,
        availableSizes: sizes,
        features: features
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean),
        fabricSpecs: fabricSpecs.trim(),
        weightGsm: Number(weightGsm) || 210,
        isWTApproved,
      });
    } catch {
      // parent handles toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 uppercase">Uniform Name / Title *</label>
        <Input
          placeholder="e.g. KPNP Elite Black Belt Dobok - Special Gold Edition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Uniform Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Selling Price (₹) *</label>
          <Input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Original Price (₹)</label>
          <Input
            type="number"
            min={1}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Fabric Weight (GSM)</label>
          <Input
            type="number"
            min={1}
            value={weightGsm}
            onChange={(e) => setWeightGsm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 uppercase">Image URLs (one per line) *</label>
        <textarea
          rows={2}
          placeholder={"/images/kpnp-dobok-1.jpg\n/images/kpnp-dobok-chest.jpg"}
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-[#FF3B30] font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 uppercase">Available Height Sizes (cm) *</label>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => {
            const selected = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selected
                    ? "bg-[#FF3B30] text-white border-[#FF3B30] shadow-md shadow-red-500/20"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 uppercase">Product Description *</label>
        <textarea
          rows={3}
          placeholder="Enter detailed description of uniform..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-[#FF3B30]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 uppercase">Features (one per line)</label>
        <textarea
          rows={3}
          placeholder={"Elite Performance Fabric: moisture-wicking poly-blend.\nErgonomic Fit: 180-degree movement."}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-[#FF3B30]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 uppercase">Fabric Specs</label>
        <Input
          placeholder="Lightweight Moisture-Wicking Breathable Poly-Blend"
          value={fabricSpecs}
          onChange={(e) => setFabricSpecs(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-900">
        <input
          type="checkbox"
          checked={isWTApproved}
          onChange={(e) => setIsWTApproved(e.target.checked)}
          className="w-4 h-4 rounded accent-[#FF3B30]"
        />
        <span>WT Approved Fabric</span>
      </label>

      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={isSubmitting}
          className="flex-1 text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="lg" onClick={onCancel} className="h-12 text-xs font-black">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
