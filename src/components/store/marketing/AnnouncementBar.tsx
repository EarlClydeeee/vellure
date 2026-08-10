import { announcementBar } from '@/lib/data/marketing-content';

export function AnnouncementBar() {
  return (
    <div
      className="bg-vellure-text py-2.5 text-center text-sm text-white"
      role="region"
      aria-label="Promotional announcement"
    >
      <p className="font-medium">{announcementBar.message}</p>
      <p className="mt-0.5 text-xs text-white/80">{announcementBar.submessage}</p>
    </div>
  );
}
