export const hero = {
    greeting: "Hey, I'm",
    name: "Prashant Chataut",
    phonetic: "/pruh-SHAANT/",
    devanagari: "प्रशान्त",
    tagline: "I build apps.",
    subtext:
        "Based in Nepal. Right now: NEBians (study notes, past papers, forums for students and teachers) and Retra (an Android GBA emulator for old Pokémon games). Also Prody, a quiet journaling app.",
    primaryCta: { label: "See my work", href: "#work" },
    secondaryCta: { label: "Open NEBians", href: "https://nebians.consica.com.np/" },
    tertiaryCta: { label: "GitHub", href: "https://github.com/prashantchataut" },
};

export const philosophy = {
    sectionTitle: "How I work.",
    items: [
        {
            title: "Put it in someone's hands.",
            body: "I don't keep ideas in notes forever. NEBians is on Play Store. Retra is on GitHub. If nobody can open it, it's still just a draft.",
        },
        {
            title: "Fewer notifications.",
            body: "I get annoyed by apps that ping you for nothing. So I try not to build that. Open it when you want. Close it when you're done.",
        },
        {
            title: "Solve a real mess.",
            body: "Class notes stuck in WhatsApp. Saves lost mid-game. Journals that turn into streak guilt. That's the stuff I pick.",
        },
    ],
};

export const about = {
    sectionTitle: "About me.",
    body: [
        "I make mobile and web apps. Design, code, ship. Mostly solo, sometimes with people who care about the same problem.",
        "NEBians is the big one: students upload notes and past papers, ask questions on the forum, check exam updates. Retra is me rebuilding the Game Boy Advance games I used to play. Prody is for writing and reflecting without a streak counter yelling at you.",
        "I live and work in Nepal. If you want to talk about a project, email works.",
    ],
    photoSrc: "/images/prashant-avatar.svg",
    photoAlt: "An illustration of Prashant as a child",
    links: {
        github: "https://github.com/prashantchataut",
        instagram: "https://instagram.com/prashantchataut_",
        email: "mailto:prashantchataut8@gmail.com",
    },
};

export const nebians = {
    id: "nebians",
    name: "NEBians",
    tagline: "Notes, papers, forums for school.",
    description:
        "Students, teachers, and institutes share study materials and talk on the forum. Web + Android. Live on Google Play.",
    status: "On Play Store",
    features: [
        "Upload and browse notes, textbooks, past papers, videos",
        "Forum for questions and class talk",
        "Exam news and Class 12 / SEE result tools",
        "Roadmap: offline downloads, richer media, tutor spaces",
    ],
    links: {
        live: "https://nebians.consica.com.np/",
        playStore: "https://play.google.com/store/apps/details?id=com.neb.ians",
        instagram: "https://www.instagram.com/the_nebians",
    },
    images: [
        { src: "/images/nebians/home.png", alt: "NEBians home screen with resources and discussions" },
        { src: "/images/nebians/shot-1.jpg", alt: "NEBians app screenshot" },
        { src: "/images/nebians/shot-2.jpg", alt: "NEBians app screenshot" },
        { src: "/images/nebians/shot-4.jpg", alt: "NEBians app screenshot" },
    ],
};

export const retra = {
    id: "retra",
    name: "Retra",
    tagline: "GBA games on your phone.",
    description:
        "Android emulator for Game Boy Advance. FireRed, Heart & Soul, Ash Gray, that whole era. Kotlin, Compose, and a custom emulation core. Still building it.",
    status: "In development",
    features: [
        "Map a real gamepad per game and test inputs live",
        "Named save checkpoints you can restore",
        "FPS and frame-time stats after you play a bit",
        "You bring your own ROMs. Nothing commercial is bundled.",
    ],
    links: {
        github: "https://github.com/prashantchataut/Retra",
    },
};

export const prody = {
    id: "prody",
    name: "Prody",
    tagline: "Journal without the streak guilt.",
    description:
        "Write a few lines, talk to a calm AI companion, send notes to future-you. No streaks. No badges for opening the app.",
    status: "Active",
    features: [
        "Journal that is fine with three words",
        "Reflection prompts that don't lecture",
        "Schedule a message to yourself later",
        "Patterns over time, not daily pressure",
    ],
    links: {
        github: "https://github.com/prashantchataut/Prody/releases/latest",
    },
    images: [
        { src: "/images/prody2.png", alt: "Prody future-self message screen" },
        { src: "/images/prody1.png", alt: "Prody journal screen" },
    ],
};

export const site = {
    title: "Prashant Chataut",
    description:
        "Prashant Chataut builds NEBians, Kairos, and Retra, and writes from Nepal.",
    url: "https://knowprashant.vercel.app",
    links: {
        github: "https://github.com/prashantchataut",
        instagram: "https://instagram.com/prashantchataut_",
        email: "mailto:prashantchataut8@gmail.com",
    },
};
