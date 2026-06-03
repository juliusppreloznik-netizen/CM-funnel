import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { stepThreeSchema, type StepThreeData } from "@shared/validation/funnel";
import { FunnelLayout } from "../components/FunnelLayout";
import { FunnelProgress } from "../components/FunnelProgress";
import { useFunnelState } from "../hooks/useFunnelState";
import { updateLead as apiUpdateLead } from "../lib/api";

/**
 * Step 3 — Final commitment / additional details.
 * On success, the lead is marked as complete and the user is redirected to /thank-you.
 */
export default function StepThree() {
  const [, navigate] = useLocation();
  const { lead, updateLead, clearLead } = useFunnelState();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StepThreeData>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      additionalInfo: lead.additionalInfo ?? "",
      consent: false,
    },
  });

  async function onSubmit(data: StepThreeData) {
    updateLead(data);

    if (lead.id) {
      await apiUpdateLead(lead.id, { ...data, currentStep: 3, completed: true });
    }

    clearLead();
    navigate("/thank-you");
  }

  return (
    <FunnelLayout>
      <FunnelProgress currentStep={3} totalSteps={3} className="mb-8" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Almost there!</h2>
          <p className="text-muted-foreground mt-1">
            Just one more step before we get you set up.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium mb-1">
              [Optional field label — e.g. "Anything else we should know?"]
            </label>
            <textarea
              id="additionalInfo"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              {...register("additionalInfo")}
            />
            {errors.additionalInfo && (
              <p className="text-destructive text-xs mt-1">{errors.additionalInfo.message}</p>
            )}
          </div>

          {/* Consent checkbox — required for TCPA / email compliance */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 accent-primary"
              {...register("consent")}
            />
            <span className="text-sm text-muted-foreground">
              I agree to receive communications and understand I can unsubscribe at any time.{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.consent && (
            <p className="text-destructive text-xs -mt-3">{errors.consent.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting…" : "Submit →"}
          </button>
        </form>
      </div>
    </FunnelLayout>
  );
}
