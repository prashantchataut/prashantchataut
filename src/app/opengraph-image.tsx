import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'Prashant Chataut | apps for learning, play, and reflection';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
    return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: '#b5d7e8', color: '#172b35', padding: '68px 76px' }}><div style={{ fontSize: 25, fontWeight: 600 }}>Prashant Chataut</div><div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ fontSize: 72, lineHeight: 1.1, maxWidth: 1000 }}>Prashant Chataut</div><div style={{ fontSize: 26, marginTop: 28 }}>Apps, ideas, and writing.</div></div><div style={{ fontSize: 20 }}>knowprashant.vercel.app</div></div>, size);
}
