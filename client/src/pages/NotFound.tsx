import { useLocation } from "wouter";
import { FunnelLayout } from "../components/FunnelLayout";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <FunnelLayout>
      <div className="text-center space-y-4 py-16">
        <h1 className="text-6xl font-extrabold text-muted-foreground">404</h1>
        <p className="text-xl font-semibold">Page not found</p>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to start
        </button>
      </div>
    </FunnelLayout>
  );
}
