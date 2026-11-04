import { SPECIES, type FlowerSpec } from './scene';
import { routes } from './assets';

/* All the words on the page live here. They are Prashant's own, taken from the live site
   and his GitHub profile; nothing is invented. */

export const person = {
  name: 'Prashant Chataut',
  line: 'I make apps to solve things that matter to me.',
  email: 'prashantchataut8@gmail.com',
  github: 'https://github.com/prashantchataut',
  instagram: 'https://instagram.com/prashantchataut_',
};

export interface Project {
  id: string;
  name: string;
  short: string;
  kind: string;
  blurb: string;
  detail: string;
  stack: string[];
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  species: keyof typeof SPECIES;
  color: string;
  fx: number;
  rel: number;
  h: number;
  lean: number;
}

export const projects: Project[] = [
  {
    id: 'nebians',
    name: 'NEBians',
    short: 'NEBians',
    kind: 'Education and community',
    blurb: 'Notes, past papers, exam updates, and a forum for students and teachers, on the web and Android.',
    detail: 'Study materials and community discussions share one home, rather than living in separate apps.',
    stack: ['Kotlin', 'Jetpack Compose', 'Django'],
    primary: { label: 'Visit NEBians', href: 'https://nebians.consica.com.np/' },
    secondary: { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.neb.ians' },
    species: 'sunflower', color: '#ffd23f', fx: 0.16, rel: 0.1, h: 38, lean: -1,
  },
  {
    id: 'kairos',
    name: 'Kairos',
    short: 'Kairos',
    kind: 'Words and discovery',
    blurb: 'Words, idioms, thoughts, and letters to your future self. Kairos grew out of NeverZero and Prody.',
    detail: 'Its feed adapts to what you save and skip; spaced repetition helps bring words back when it is time to practise.',
    stack: ['Kotlin', 'Compose', 'Room', 'WorkManager'],
    primary: { label: 'Explore Kairos', href: 'https://github.com/prashantchataut/Kairos' },
    secondary: { label: 'Launch film', href: 'https://drive.google.com/file/d/1_NoA7pZXYgWQ87At6mw-GQxNafWlFywB/view?usp=sharing' },
    species: 'forgetmenot', color: '#7ba6ff', fx: 0.4, rel: 0.34, h: 27, lean: 1,
  },
  {
    id: 'retra',
    name: 'Retra',
    short: 'Retra',
    kind: 'Games and emulation',
    blurb: 'A Game Boy Advance emulator for Android, built for homebrew and games you own.',
    detail: 'Alongside its own C++ emulation core, Retra includes a patcher and Mochi Hop, an original game written in C.',
    stack: ['Kotlin', 'Compose', 'C++17', 'JNI'],
    primary: { label: 'Explore Retra', href: 'https://github.com/prashantchataut/Retra' },
    species: 'cosmos', color: '#ff9cc7', fx: 0.67, rel: 0.1, h: 30, lean: -1,
  },
  {
    id: 'glamo',
    name: 'Glamo Nepal',
    short: 'Glamo',
    kind: 'Client work',
    blurb: 'I built the ecommerce site, native point of sale, and admin system for Glamo Nepal.',
    detail: 'The storefront is paired with tools for running the business, with a shared API designed for catalog and offline sales sync.',
    stack: ['Next.js', 'TypeScript', 'Hono', 'Cloudflare'],
    primary: { label: 'Visit the store', href: 'https://www.glamonepal.com/' },
    secondary: { label: 'Repository', href: 'https://github.com/prashantchataut/glamo-nepal' },
    species: 'rhododendron', color: '#f0483f', fx: 0.87, rel: 0.34, h: 29, lean: 1,
  },
];

export const flowerSpecs: FlowerSpec[] = projects.map((p) => ({
  id: p.id, fx: p.fx, rel: p.rel, h: p.h, sp: SPECIES[p.species], lean: p.lean,
}));

export const writing = [
  { kind: 'Poem', title: 'Grace', href: routes.writes + '/grace', flower: 'blush' as const },
  { kind: 'Story', title: 'Where the first idea led', href: routes.writes + '/where-the-first-idea-led', flower: 'forgetmenot' as const },
];
