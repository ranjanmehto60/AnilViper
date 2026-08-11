"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ruler, CheckCircle2 } from "lucide-react";

interface SizeGuideModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SizeGuideModal({ children, open, onOpenChange }: SizeGuideModalProps) {
  const sizeChart = [
    { size: 110, height: "100 - 110 cm", weight: "15 - 20 kg", age: "4 - 5 Yrs", category: "Junior Kids" },
    { size: 120, height: "110 - 120 cm", weight: "20 - 25 kg", age: "6 - 7 Yrs", category: "Junior Kids" },
    { size: 130, height: "120 - 130 cm", weight: "25 - 32 kg", age: "8 - 9 Yrs", category: "Junior Kids" },
    { size: 140, height: "130 - 140 cm", weight: "32 - 40 kg", age: "10 - 11 Yrs", category: "Cadet" },
    { size: 150, height: "140 - 150 cm", weight: "40 - 48 kg", age: "12 - 13 Yrs", category: "Cadet" },
    { size: 160, height: "150 - 160 cm", weight: "48 - 58 kg", age: "Junior / Small", category: "Junior / Adult" },
    { size: 170, height: "160 - 170 cm", weight: "58 - 68 kg", age: "Adult Medium", category: "Senior Adult" },
    { size: 180, height: "170 - 180 cm", weight: "68 - 80 kg", age: "Adult Large", category: "Senior Adult" },
    { size: 190, height: "180 - 190 cm", weight: "80 - 95 kg", age: "Adult XL", category: "Heavy Weight" },
    { size: 200, height: "190 - 200 cm", weight: "95 - 105 kg", age: "Adult XXL", category: "Heavy Weight" },
    { size: 210, height: "200 - 210 cm", weight: "105 - 115 kg", age: "Adult 3XL", category: "Tall / Heavy Weight" },
    { size: 220, height: "210 - 220 cm", weight: "115 - 125 kg", age: "Adult 4XL", category: "Tall / Heavy Weight" },
    { size: 230, height: "220 - 230 cm", weight: "125 - 135 kg", age: "Adult 5XL", category: "Tall / Heavy Weight" },
    { size: 240, height: "230 - 240 cm", weight: "135+ kg", age: "Adult 6XL", category: "Tall / Heavy Weight" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl border-border bg-surface text-foreground shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-medium tracking-tight text-ink">
            <Ruler className="h-5 w-5 text-accent" />
            Find your dobok size
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm leading-relaxed text-muted">
            Taekwondo uniforms (Doboks) are sized according to total height in centimeters. Choose the size that matches your practitioner&apos;s height. If between sizes or heavy build, select the next size up.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border bg-background">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-2 text-[10px] uppercase text-muted">
                <tr>
                  <th className="p-3 font-semibold text-accent">Uniform size</th>
                  <th className="p-3 font-semibold">Athlete height</th>
                  <th className="p-3 font-semibold">Approx. weight</th>
                  <th className="p-3 font-semibold">Age / fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted">
                {sizeChart.map((row) => (
                  <tr key={row.size} className="transition-colors hover:bg-surface-2">
                    <td className="p-3 font-semibold text-ink">{row.size} cm</td>
                    <td className="p-3">{row.height}</td>
                    <td className="p-3">{row.weight}</td>
                    <td className="p-3">{row.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 rounded-xl border border-accent/25 bg-accent/10 p-4 text-xs text-ink">
            <h4 className="flex items-center gap-1.5 font-semibold text-ink">
              <CheckCircle2 className="h-4 w-4 text-accent" /> Fit notes
            </h4>
            <ul className="list-inside list-disc space-y-1 text-[11px] text-muted">
              <li>Our Viper Gears Doboks undergo pre-shrunk washing so shrinkage is under 1.5%.</li>
              <li>Trousers feature an adjustable elastic waistband for comfort.</li>
              <li>Need custom Dojang academy sizing or bulk orders? Call our Chattarpur team at +91-9958419286.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
