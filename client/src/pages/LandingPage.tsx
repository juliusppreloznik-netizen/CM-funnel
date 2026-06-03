import { useLocation } from "wouter";
import { FunnelLayout } from "../components/FunnelLayout";

/**
 * Funnel entry point — headline, sub-headline, and primary CTA.
 * Copy and design tokens are intentionally left as placeholders
 * to be filled in during the copy/design phase.
 */
export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <FunnelLayout>
      <div className="text-center space-y-6">
        {/* Hero headline — replace with campaign copy */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          [Headline Goes Here]
        </h1>

        {/* Sub-headline */}
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          [Sub-headline — describe the core benefit or promise]
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => navigate("/step/1")}
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Get Started &rarr;
        </button>

        {/* Trust indicators placeholder */}
        <p className="text-sm text-muted-foreground">
          [Trust line — e.g. "No credit card required · 100% free to start"]
        </p>
      </div>
    </FunnelLayout>
  );
}
