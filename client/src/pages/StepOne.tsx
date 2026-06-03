import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { stepOneSchema, type StepOneData } from "@shared/validation/funnel";
import { FunnelLayout } from "../components/FunnelLayout";
import { FunnelProgress } from "../components/FunnelProgress";
import { useFunnelState } from "../hooks/useFunnelState";
import { submitLead } from "../lib/api";

/**
 * Step 1 — Collect name, email, and phone number.
 * On success the lead ID is stored in sessionStorage for subsequent steps.
 */
export default function StepOne() {
  const [, navigate] = useLocation();
  const { lead, updateLead } = useFunnelState();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StepOneData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      firstName: lead.firstName ?? "",
      lastName: lead.lastName ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
    },
  });

  async function onSubmit(data: StepOneData) {
    updateLead(data);
    const result = await submitLead({ ...lead, ...data, currentStep: 1 });

    if (result.success && result.data) {
      updateLead({ id: result.data.id });
    }

    navigate("/step/2");
  }

  return (
    <FunnelLayout>
      <FunnelProgress currentStep={1} totalSteps={3} className="mb-8" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Let&apos;s get started</h2>
          <p className="text-muted-foreground mt-1">
            Tell us a little about yourself so we can personalise your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : "Continue →"}
          </button>
        </form>
      </div>
    </FunnelLayout>
  );
}
