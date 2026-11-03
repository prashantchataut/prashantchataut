import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'Notes from the work — Prashant Chataut';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
    return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: '#f8f8f3', color: '#172b35', padding: '68px 76px' }}><div style={{ fontSize: 25, fontWeight: 600 }}>Prashant Chataut</div><div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ fontSize: 78 }}>Notes from the work.</div><div style={{ fontSize: 26, marginTop: 28 }}>On making things, learning, and paying attention.</div></div><div style={{ fontSize: 20 }}>knowprashant.vercel.app/writes</div></div>, size);
}
