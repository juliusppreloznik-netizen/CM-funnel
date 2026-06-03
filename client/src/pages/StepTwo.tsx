import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { stepTwoSchema, type StepTwoData } from "@shared/validation/funnel";
import { FunnelLayout } from "../components/FunnelLayout";
import { FunnelProgress } from "../components/FunnelProgress";
import { useFunnelState } from "../hooks/useFunnelState";
import { updateLead as apiUpdateLead } from "../lib/api";

/**
 * Step 2 — Qualification questions.
 * Question copy is left as placeholders; replace with campaign-specific questions.
 */
export default function StepTwo() {
  const [, navigate] = useLocation();
  const { lead, updateLead } = useFunnelState();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StepTwoData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      qualifierOne: lead.qualifierOne ?? "",
      qualifierTwo: lead.qualifierTwo ?? "",
    },
  });

  async function onSubmit(data: StepTwoData) {
    updateLead(data);

    if (lead.id) {
      await apiUpdateLead(lead.id, { ...data, currentStep: 2 });
    }

    navigate("/step/3");
  }

  return (
    <FunnelLayout>
      <FunnelProgress currentStep={2} totalSteps={3} className="mb-8" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">A few quick questions</h2>
          <p className="text-muted-foreground mt-1">
            This helps us match you with the right solution.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Qualifier 1 — replace label and options with campaign copy */}
          <fieldset>
            <legend className="text-sm font-medium mb-2">
              [Qualifier question 1 — e.g. "What best describes your situation?"]
            </legend>
            <div className="space-y-2">
              {["Option A", "Option B", "Option C"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value={opt}
                    className="accent-primary"
                    {...register("qualifierOne")}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.qualifierOne && (
              <p className="text-destructive text-xs mt-1">{errors.qualifierOne.message}</p>
            )}
          </fieldset>

          {/* Qualifier 2 */}
          <fieldset>
            <legend className="text-sm font-medium mb-2">
              [Qualifier question 2 — e.g. "What is your primary goal?"]
            </legend>
            <div className="space-y-2">
              {["Goal A", "Goal B", "Goal C"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value={opt}
                    className="accent-primary"
                    {...register("qualifierTwo")}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.qualifierTwo && (
              <p className="text-destructive text-xs mt-1">{errors.qualifierTwo.message}</p>
            )}
          </fieldset>

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
