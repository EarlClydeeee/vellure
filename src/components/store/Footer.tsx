import { Mail } from 'lucide-react';
import { NavLink } from '@/components/store/NavLink';
import { NewsletterCapture } from '@/components/store/marketing/NewsletterCapture';

const SOCIAL_LINKS = [
  { label: 'X', href: 'https://x.com/vellure' },
  { label: 'Facebook', href: 'https://facebook.com/vellure' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/vellure' },
  { label: 'Instagram', href: 'https://instagram.com/vellure' },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-vellure-primary px-4 py-12 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h3 className="font-display text-xl font-medium md:text-2xl">Ready to Get Our New Stuff?</h3>
            <p className="mt-1 text-sm text-white/70">
              Subscribe for updates and exclusive offers.
            </p>
          </div>
          <NewsletterCapture variant="footer" className="w-full max-w-md sm:w-auto" />
        </div>
      </div>

      <div className="border-t bg-background px-4 py-12">
        <div className="container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="font-display text-lg font-medium tracking-tight">Vellure</h3>
            <p className="text-sm text-muted-foreground">
              Premium products, curated for you.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">About</h4>
            <nav className="flex flex-col gap-2">
              <NavLink
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </NavLink>
              <NavLink
                href="/blog/meet-the-team"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Meet The Team
              </NavLink>
              <NavLink
                href="/contact"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </NavLink>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <nav className="flex flex-col gap-2">
              <NavLink
                href="/#faq"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </NavLink>
              <NavLink
                href="/#faq-shipping"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Shipping
              </NavLink>
              <NavLink
                href="/#faq-returns"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Return
              </NavLink>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Follow Us</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                  aria-label={label}
                >
                  {label[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-12 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vellure. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
