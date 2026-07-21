"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function ClosingCTA() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Check your inbox!", {
      description: `We've sent a magic link to ${data.email}`,
    });
    reset();
  };

  return (
    <section id="cta" className="py-24 md:py-32">
      <div className="container max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
           <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100 mb-4">
            Start building in 30 seconds.
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            No credit card required. Free forever plan available.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            noValidate
          >
            <div className="flex-1">
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-zinc-100 placeholder-text-tertiary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-error text-left mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <>
                  Start Building <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <span>G2: 4.8/5</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <ShieldCheck size={12} className="text-success" />
              <span>SOC 2</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <ShieldCheck size={12} className="text-primary" />
              <span>GDPR</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
