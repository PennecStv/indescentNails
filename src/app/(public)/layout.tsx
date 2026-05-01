import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { NoiseOverlay } from "@/components/public/motion/noise-overlay";
import { PageLoader } from "@/components/public/motion/page-loader";
import { ScrollProgress } from "@/components/public/motion/scroll-progress";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-cream">
      <NoiseOverlay />
      <PageLoader />
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1 relative z-[2]">{children}</main>
      <SiteFooter />
    </div>
  );
}
