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
    { size: 200, height: "190 - 200 cm", weight: "95+ kg", age: "Adult XXL", category: "Heavy Weight" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-wider uppercase text-slate-900 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#FF3B30]" />
            KPNP & Viper Taekwondo Dobok Sizing Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600">
            Taekwondo uniforms (Doboks) are sized according to total height in centimeters. Choose the size that matches your practitioner&apos;s height. If between sizes or heavy build, select the next size up.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[11px]">
                <tr>
                  <th className="p-3 font-extrabold text-[#FF3B30]">Uniform Size</th>
                  <th className="p-3 font-bold">Athlete Height</th>
                  <th className="p-3 font-bold">Approx Weight</th>
                  <th className="p-3 font-bold">Age / Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {sizeChart.map((row) => (
                  <tr key={row.size} className="hover:bg-slate-100/60 transition-colors">
                    <td className="p-3 font-black text-slate-900">{row.size} cm</td>
                    <td className="p-3 text-slate-700">{row.height}</td>
                    <td className="p-3 text-slate-600">{row.weight}</td>
                    <td className="p-3 text-slate-600">{row.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1.5 text-xs text-slate-800">
            <h4 className="font-bold text-[#FF6B61] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF3B30]" /> Pro Tips for Perfect Fit:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
              <li>Our KPNP Doboks undergo pre-shrunk washing so shrinkage is under 1.5%.</li>
              <li>Trousers feature an adjustable elastic waistband for comfort.</li>
              <li>Need custom Dojang academy sizing or bulk orders? Call our Chattarpur team at +91-9871674886.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
