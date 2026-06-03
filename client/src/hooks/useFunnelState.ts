import { useState, useCallback } from "react";
import type { FunnelLead } from "@shared/types/funnel";

const STORAGE_KEY = "cm_funnel_lead";

/**
 * Manages the in-progress lead data across funnel steps.
 * Data is persisted to sessionStorage so a page refresh does not lose progress.
 */
export function useFunnelState() {
  const [lead, setLeadState] = useState<Partial<FunnelLead>>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const updateLead = useCallback((updates: Partial<FunnelLead>) => {
    setLeadState((prev) => {
      const next = { ...prev, ...updates };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // sessionStorage may be unavailable in some environments
      }
      return next;
    });
  }, []);

  const clearLead = useCallback(() => {
    setLeadState({});
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { lead, updateLead, clearLead };
}
