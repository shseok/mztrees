import { useTrackScreenViews } from "@/hooks/useTrackScreenViews";

function AnalyticsTrackingEventsProvider({
  children,
}: React.PropsWithChildren) {
  if (process.env.NODE_ENV === "production") {
    useTrackScreenViews();
  }

  return <>{children}</>;
}

export default AnalyticsTrackingEventsProvider;
