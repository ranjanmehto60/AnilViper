"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select an enquiry subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});
type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema), defaultValues: { fullName: "", phone: "", email: "", subject: "Bulk Academy Order", message: "" } });
  const onSubmit = async () => { await new Promise((resolve) => setTimeout(resolve, 800)); setSubmitted(true); toast.success("Your message has been sent to the Viper team."); reset(); };

  return (
    <div className="editorial-page min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <div className="max-w-2xl"><p className="section-kicker mb-3">Questions welcome</p><h1 className="section-title">Let&apos;s talk gear.</h1><p className="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">Need sizing help, a bulk quote, or an update on an order? Send a note and the Chattarpur team will get back to you.</p></div>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <section className="surface-card rounded-2xl p-6 sm:p-8"><div className="mb-7"><p className="section-kicker mb-2">Send a message</p><h2 className="text-2xl font-medium tracking-tight text-ink">How can we help?</h2></div>{submitted ? <div className="rounded-xl border border-accent/25 bg-accent/10 p-7 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-accent" /><h3 className="mt-4 text-xl font-medium text-ink">Message received.</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">We&apos;ll be in touch using the details you shared.</p><Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6 rounded-full text-xs">Send another message</Button></div> : <form onSubmit={handleSubmit(onSubmit)} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><FormField label="Full name" error={errors.fullName?.message}><Input placeholder="Your name" {...register("fullName")} /></FormField><FormField label="Phone number" error={errors.phone?.message}><Input placeholder="10-digit number" maxLength={10} {...register("phone")} /></FormField></div><div className="grid gap-4 sm:grid-cols-2"><FormField label="Email address" error={errors.email?.message}><Input placeholder="you@example.com" type="email" {...register("email")} /></FormField><FormField label="What do you need?" error={errors.subject?.message}><select {...register("subject")} className="h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-accent"><option value="Bulk Academy Order">Bulk academy order</option><option value="Uniform Size Guidance">Uniform size guidance</option><option value="Order Tracking Support">Order tracking support</option><option value="Custom Embroidery Inquiry">Custom embroidery enquiry</option></select></FormField></div><FormField label="Message" error={errors.message?.message}><textarea rows={5} placeholder="Tell us what you need..." {...register("message")} className="w-full rounded-lg border border-border bg-background p-3.5 text-sm text-foreground outline-none placeholder:text-subtle focus:border-accent" /></FormField><Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full bg-ink text-sm text-white hover:bg-accent"><Send className="h-4 w-4" /> {isSubmitting ? "Sending..." : "Send message"}</Button></form>}</section>

          <aside className="space-y-5"><div className="surface-card rounded-2xl p-6 sm:p-8"><p className="section-kicker mb-3">Find the team</p><h2 className="text-2xl font-medium tracking-tight text-ink">Viper Gears, Delhi.</h2><div className="mt-7 space-y-5 text-sm"><ContactDetail icon={<MapPin className="h-4 w-4" />} title="Workshop & warehouse" detail={<>Chattarpur, New Delhi<br />India — 110074</>} /><ContactDetail icon={<Phone className="h-4 w-4" />} title="Phone & WhatsApp" detail={<a href="tel:+919958419286" className="font-semibold text-accent hover:underline">+91 99584 19286</a>} /><ContactDetail icon={<Mail className="h-4 w-4" />} title="Email" detail={<a href="mailto:contact@vipergears.in" className="font-semibold text-ink hover:text-accent">contact@vipergears.in</a>} /></div><a href="https://wa.me/919958419286" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border-strong text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"><MessageCircle className="h-4 w-4 text-accent" /> Message on WhatsApp</a></div><div className="relative h-64 overflow-hidden rounded-2xl border border-border bg-surface-2"><iframe title="Viper Gears Chattarpur Delhi Location Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14022.951559811568!2d77.172944!3d28.502931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1e1f727c9b8b%3A0x6a0a0300a89d700!2sChhatarpur%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></aside>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block space-y-1.5"><span className="text-xs font-semibold text-ink">{label}</span>{children}{error && <span className="block text-[11px] font-semibold text-danger">{error}</span>}</label>; }
function ContactDetail({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: React.ReactNode }) { return <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">{icon}</span><div><p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">{title}</p><div className="mt-1 leading-relaxed text-ink">{detail}</div></div></div>; }
