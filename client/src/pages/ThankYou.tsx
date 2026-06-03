import { FunnelLayout } from "../components/FunnelLayout";

/**
 * Post-conversion confirmation page.
 * Replace placeholder copy with campaign-specific next-step instructions.
 */
export default function ThankYou() {
  return (
    <FunnelLayout>
      <div className="text-center space-y-6 py-12">
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          [Thank You Headline]
        </h1>

        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          [Confirmation message — e.g. "We&apos;ve received your information and will be in touch within 24 hours."]
        </p>

        {/* Next-step CTA placeholder */}
        <div className="pt-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            [Next step instruction — e.g. "While you wait, watch this short video:"]
          </p>
          {/* Video embed or CTA button goes here */}
        </div>
      </div>
    </FunnelLayout>
  );
}
