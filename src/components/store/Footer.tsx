import Link from 'next/link';
import { Globe, Camera, MessageCircle, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold tracking-tight">Vellure</h3>
            <p className="text-sm text-muted-foreground">
              Premium products, curated for you.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/products"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cart
              </Link>
              <Link
                href="/orders"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Orders
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Contact</h4>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@vellure.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                hello@vellure.com
              </a>
              <a
                href="tel:+12345678900"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                +1 234 567 8900
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Camera className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vellure. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
