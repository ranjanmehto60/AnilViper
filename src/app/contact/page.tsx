"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Instagram, Facebook, Youtube } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a inquiry subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      subject: "Bulk Academy Order",
      message: "",
    },
  });

  const onSubmit = async () => {
    await new Promise((res) => setTimeout(res, 800));
    setSubmitted(true);
    toast.success("Thank you! Your message has been sent to our Chattarpur Delhi team.");
    reset();
  };

  return (
    <div className="bg-[#F8FAFC] py-12 min-h-screen text-slate-900">
      <div className="container mx-auto px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#FF3B30] uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" /> WE&apos;RE HERE TO HELP
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tight bebas-font">
            GET IN TOUCH WITH VIPER GEARS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Have questions about Dobok sizing, bulk academy discount pricing, or shipping? Contact our team in Chattarpur, Delhi.
          </p>
        </div>

        {/* 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below and our customer support team will get back to you within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#FF3B30] mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 uppercase">Inquiry Received!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to Viper Gears. One of our academy coordinators will call or WhatsApp you at your provided phone number shortly.
                </p>
                <Button variant="default" onClick={() => setSubmitted(false)} size="sm" className="text-xs bg-[#FF3B30] text-white">
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Full Name *</label>
                    <Input placeholder="Master Rahul Verma" {...register("fullName")} />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-500 font-semibold">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Phone Number (10 Digits) *</label>
                    <Input placeholder="9871674886" maxLength={10} {...register("phone")} />
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 font-semibold">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Email Address *</label>
                    <Input placeholder="rahul@dojang.com" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 font-semibold">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Inquiry Subject *</label>
                    <select
                      {...register("subject")}
                      className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#FF3B30]"
                    >
                      <option value="Bulk Academy Order">Bulk Academy / Dojang Order</option>
                      <option value="Uniform Size Guidance">Uniform Size Guidance</option>
                      <option value="Order Tracking Support">Order Tracking & Support</option>
                      <option value="Custom Embroidery Inquiry">Custom Embroidery Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Your Message *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us your quantity requirements, sizes needed, or academy details..."
                    {...register("message")}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30]"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-500 font-semibold">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg shadow-red-500/20"
                >
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Right Column: Company Details & Google Maps Embed */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
                Company Headquarters
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#FF3B30] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase">Address:</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Viper Gears Manufacturing & Warehouse<br />
                      Chattarpur, New Delhi, India - 110074
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#FF3B30] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase">Phone & WhatsApp:</h4>
                    <a href="tel:+919871674886" className="text-[#FF3B30] font-extrabold hover:underline">
                      +91-9871674886
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#FF3B30] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase">Email:</h4>
                    <a href="mailto:contact@vipergears.in" className="text-slate-600 hover:text-slate-900 font-medium">
                      contact@vipergears.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Follow Viper Gears:</h4>
                <div className="flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-[#FF3B30] hover:bg-slate-200 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-[#FF3B30] hover:bg-slate-200 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-[#FF3B30] hover:bg-slate-200 transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Iframe Embed */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 h-64 relative bg-slate-100 shadow-xl">
              <iframe
                title="Viper Gears Chattarpur Delhi Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14022.951559811568!2d77.172944!3d28.502931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1e1f727c9b8b%3A0x6a0a0300a89d700!2sChhatarpur%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
