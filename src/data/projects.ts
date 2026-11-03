export interface Project {
    id: string;
    name: string;
    tagline: string;
    description: string;
    status: "active" | "in-progress" | "archived";
    featured: boolean;
    links: {
        github: string | null;
        live: string | null;
        playStore?: string | null;
        instagram?: string | null;
    };
    tags: string[];
    image: string;
    accentColor?: string;
    features?: string[];
}

export const projects: Project[] = [
    {
        id: "nebians",
        name: "NEBians",
        tagline: "Notes, papers, forums for school.",
        description:
            "Students and teachers share study materials and talk on the forum. Web + Android, on Google Play.",
        status: "active",
        featured: true,
        links: {
            github: null,
            live: "https://nebians.consica.com.np/",
            playStore: "https://play.google.com/store/apps/details?id=com.neb.ians",
            instagram: "https://www.instagram.com/the_nebians",
        },
        tags: ["Education", "Mobile", "Community", "Nepal"],
        features: [
            "Notes, textbooks, past papers, videos",
            "Forum discussions",
            "Exam news and result tools",
        ],
        image: "/images/nebians/home.png",
        accentColor: "#2563EB",
    },
    {
        id: "retra",
        name: "Retra",
        tagline: "GBA games on your phone.",
        description:
            "Android GBA emulator. FireRed, Heart & Soul, Ash Gray. Kotlin, Compose, and a custom emulation core. Still in development.",
        status: "in-progress",
        featured: true,
        links: {
            github: "https://github.com/prashantchataut/Retra",
            live: null,
        },
        tags: ["Android", "Kotlin", "Emulator", "Compose"],
        features: [
            "Per-game gamepad mapping",
            "Save checkpoints",
            "Frame-time performance stats",
        ],
        image: "/images/about-abstract.png",
        accentColor: "#D97706",
    },
    {
        id: "prody",
        name: "Prody",
        tagline: "Journal without the streak guilt.",
        description:
            "Write, reflect, message future-you. No streaks. No badges for opening the app.",
        status: "active",
        featured: false,
        links: {
            github: "https://github.com/prashantchataut/Prody/releases/latest",
            live: null,
        },
        tags: ["React Native", "AI", "Mental Health"],
        features: [
            "Short journaling",
            "Calm reflection prompts",
            "Messages to future-you",
        ],
        image: "/images/prody1.png",
        accentColor: "#D97706",
    },
];
