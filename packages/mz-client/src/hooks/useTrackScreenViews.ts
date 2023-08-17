// import analytics from "@/lib/analytics";
import { getFirebaseAnalytics, initializeAnalytics } from "@/lib/analytics";
import { isBrowser } from "@/lib/isBrowser";
import { logEvent } from "firebase/analytics";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

export function useTrackScreenViews() {
  const pathname = usePathname();
  const onRouteChangeComplete = useCallback(() => {
    if (!isBrowser()) {
      return;
    }

    const title = document.title;
    const analytics = getFirebaseAnalytics();
    if (!analytics) return;

    logEvent(analytics, "page_view", {
      page_title: title,
      page_path: pathname,
    });
  }, [pathname]);

  useEffect(() => {
    initializeAnalytics();
    onRouteChangeComplete();
  }, [pathname, onRouteChangeComplete]);
}
