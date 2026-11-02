import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Writes - Prashant Chataut';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0C0A09',
                }}
            >
                <p
                    style={{
                        fontSize: 20,
                        color: '#FBBF24',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        margin: 0,
                    }}
                >
                    Notes on building
                </p>
                <h1
                    style={{
                        fontSize: 80,
                        fontWeight: 700,
                        color: '#F5F0EB',
                        lineHeight: 1,
                        margin: 0,
                        marginTop: 16,
                        letterSpacing: '-0.03em',
                    }}
                >
                    Writes.
                </h1>
                <p
                    style={{
                        fontSize: 22,
                        color: '#A8A099',
                        margin: 0,
                        marginTop: 24,
                    }}
                >
                    Short thoughts.
                </p>
            </div>
        ),
        { ...size }
    );
}