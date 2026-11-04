'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function SiteFooter() {
  const home = usePathname() === '/';
  return <Footer prefix={home ? '' : '/'} nowHref="/now" />;
}
