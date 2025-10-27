"use client";

declare global {
  interface Window {
    gtag: (...args: (string | { [key: string]: string | number | undefined })[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Track page views
export const pageview = (url: string) => {
  if (!GA_ID) return;
  window.gtag("config", GA_ID, {
    page_path: url,
  });
};

// Generic event tracker
export const event = ({
  action,
  category,
  label,
  value,
  params,
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, string | number>;
}) => {
  if (!GA_ID) return;
  if (!window.gtag) {
    console.warn("gtag not loaded yet");
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
    ...params,
  });
};
