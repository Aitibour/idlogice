"use client";

import { useState } from "react";
import { X, CalendarCheck, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export function BookingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all btn-shimmer shadow-sm shadow-primary/20"
      >
        <CalendarCheck className="size-4" />
        Book a Consultation
        <ArrowRight className="size-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Book a consultation"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal card */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />

            <div className="p-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Book a session</p>
                  <h2 className="text-xl font-bold">Request an appointment</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    A certified consultant will confirm your slot within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary hover:bg-muted transition-colors shrink-0 ml-4"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
