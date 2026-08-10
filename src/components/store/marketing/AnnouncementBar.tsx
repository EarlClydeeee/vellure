import { announcementBar } from '@/lib/data/marketing-content';

export function AnnouncementBar() {
  return (
    <div
      className="bg-vellure-primary py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white sm:text-xs"
      role="region"
      aria-label="Promotional announcement"
    >
      {announcementBar.bannerLine}
    </div>
  );
}
