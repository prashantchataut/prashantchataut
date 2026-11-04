import Link from 'next/link';
import PixelIcon from '@/components/pixel/PixelIcon';
import { GrowthPath, PortraitReveal, type Step } from './AboutBits';

const STEPS: Step[] = [
    { title: 'Labelwise', text: 'Also called IngredAI. It reads the labels on medicines, chemicals, beauty products and snacks.', kind: 3 },
    { title: 'NeverZero', text: 'A to-do list, a Pomodoro timer and a library of productivity tips.', kind: 1 },
    { title: 'Prody, then Kairos', text: 'The same project, changing as I kept working on it. Today it is words, idioms and letters to a future self.', kind: 2 },
    { title: 'NEBians', text: 'Notes, past papers, exam updates and conversations, for students and teachers.', kind: 0 },
    { title: 'Retra', text: 'A Game Boy Advance emulator with its own engine, a patcher and an original game.', kind: 4 },
];

export default function About() {
    return (
        <section id="about" className="about about-v2 section-wrap" aria-labelledby="about-title">
            <div className="about-grid">
                <PortraitReveal />
                <div className="about-copy">
                    <h2 id="about-title">Hi, I’m Prashant.</h2>
                    <p>I’m a developer from Nepal. I make apps to solve things that matter to me.</p>
                    <p>I started building in grade 10. Since then I’ve worked on everything from study resources to a Game Boy Advance emulator.</p>
                    <Link className="text-link" href="/writes/where-the-first-idea-led">
                        How the projects began <PixelIcon name="out" />
                    </Link>
                </div>
            </div>
            <div className="about-path">
                <h3>One idea led to the next.</h3>
                <GrowthPath steps={STEPS} />
            </div>
        </section>
    );
}
