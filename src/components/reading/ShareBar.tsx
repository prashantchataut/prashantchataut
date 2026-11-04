'use client';
import { useEffect, useRef, useState } from 'react';

/** Share a piece with the system share sheet where there is one, or copy its link. */
export default function ShareBar({ title, path }: { title: string; path: string }) {
    const [state, setState] = useState<'idle' | 'copied' | 'fail'>('idle');
    const [canShare, setCanShare] = useState(false);
    const timer = useRef<number | undefined>(undefined);
    useEffect(() => {
        setCanShare(typeof navigator.share === 'function');
        return () => window.clearTimeout(timer.current);
    }, []);
    const url = () => `${location.origin}${path}`;
    const flash = (s: 'copied' | 'fail') => {
        setState(s);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setState('idle'), 2200);
    };
    const copy = async () => {
        try { await navigator.clipboard.writeText(url()); flash('copied'); } catch { flash('fail'); }
    };
    const share = async () => {
        try { await navigator.share({ title: `${title} by Prashant Chataut`, url: url() }); } catch { /* dismissed */ }
    };
    return (
        <div className="share-bar">
            {canShare && <button type="button" onClick={share}>Share</button>}
            <button type="button" onClick={copy}>{state === 'copied' ? 'Link copied' : state === 'fail' ? 'Could not copy' : 'Copy link'}</button>
            <span className="sr-only" role="status">{state === 'copied' ? 'Link copied' : ''}</span>
        </div>
    );
}
