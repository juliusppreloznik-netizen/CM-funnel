import { cn } from "../lib/utils";

interface FunnelLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Consistent outer wrapper for every funnel page.
 * Provides centred, max-width constrained content with responsive padding.
 */
export function FunnelLayout({ children, className }: FunnelLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main
        className={cn(
          "flex-1 w-full max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8",
          className
        )}
      >
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} CM Funnel. All rights reserved.
      </footer>
    </div>
  );
}
