'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function SiteHeader() {
  const home = usePathname() === '/';
  return <Header prefix={home ? '' : '/'} solid={!home} />;
}
