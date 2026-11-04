# Adding writing

When Prashant asks to add a piece, make the whole reading experience without waiting for a second request.

1. Preserve supplied writing exactly unless asked to edit it. Add the piece and metadata to `src/data/posts.ts`.
2. Read the piece and choose a specific visual and motion idea from it. Make a distinct cover in both themes and a reading environment that belongs to this piece, not a stock image or the same generic effect with another color.
3. Add purposeful in-page motion. Extend `ReadingAtmosphere` with a suitable particle shape, movement, and, where meaningful, interaction with the actual text. Its existing petal collision code uses text-line rectangles and can be adapted. Make pointer interaction optional; the experience should also work without a mouse.
4. Respect reduced motion and readable contrast. Do not cover the text or interfere with selection, touch, navigation, or screen readers. Bound particle counts and clean up animation frames and listeners.
5. Preview desktop and mobile in both themes, test the full reading page, scrolling, keyboard navigation and theme persistence. Avoid em dashes, filler, and invented personal details. Keep custom art intentional and editable.

## Marginalia

Each passage gets one hand-drawn line illustration in the margin, chosen from what that passage says (`src/components/reading/MarginArt.tsx`). Add a set keyed by the post `theme`, with one drawing per passage, in order. Draw with organic strokes (a feather, a bottle, a rabbit), not circles, squares or triangles. Strokes draw themselves when scrolled into view and every animation has a reduced-motion fallback. Set the `--art-ink` and `--art-accent` tokens for the theme in `bloom.css`.

## Share cards

Each piece gets its own social card at `/writes/<slug>/og.jpg` (see `src/app/writes/[slug]/og.jpg/route.ts` and `coverCard` in `src/lib/og.tsx`). It is the piece's cover art with the title set in the open space beside it. For a new piece, export its day cover as a 1200x630 JPEG into `src/assets/og/` and add its ink colour in the route. Cards are JPEG so they stay under the roughly 300KB that WhatsApp expects.
