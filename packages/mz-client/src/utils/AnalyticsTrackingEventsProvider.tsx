import { useTrackScreenViews } from '@/hooks/useTrackScreenViews';

function AnalyticsTrackingEventsProvider({
  children,
}: React.PropsWithChildren) {
  const trackScreenViews = useTrackScreenViews;
  if (process.env.NODE_ENV === 'production') {
    trackScreenViews();
  }

  return <>{children}</>;
}

export default AnalyticsTrackingEventsProvider;
