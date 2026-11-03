export const posts = [
    {
        slug: 'grace', title: 'Grace', kind: 'Poem', theme: 'grace',
        excerpt: 'A poem about what remains, and what might have been.',
        body: [
            'Beyong the shaking storm,\nthe world collapsed,\nsoldiers fought their toughest battles,\nsought treaty,\nsought relief,\nsought end.',
            'stillness,\nstillness in bodies that bid farewell,\nshallowness,\nshallowness in bodies that had “life”.',
            'In the same world once lived,\ngrace,\ngrace that kept them ecstatic,\ncheerfulness,\ncheerfulness that grazed their steps,',
            'Out there watching from window,\nwas posterity,\nwith regrets,\nlooking at what it could’ve had.',
            'Sought a chance to fix it, the posterity\nbut,\nthe window had closed before it knew to look.',
            '……………..',
        ],
    },
    {
        slug: 'where-the-first-idea-led', title: 'Where the first idea led', kind: 'Story', theme: 'journey',
        excerpt: 'From a first experiment in grade 10 to NEBians, Kairos, and Retra.',
        body: [
            'I was in grade 10 when I came across the Cursor desktop app and discovered vibe coding. I started building without knowing where it would lead.',
            'My first project was Labelwise, also called IngredAI. It was an app for reading the labels on medicines, chemicals, beauty products, and snacks—an attempt to help people understand what was in a product and whether it might be harmful.',
            'Then came NeverZero. At first it was about getting things done: a to-do list, a Pomodoro timer, and a library of productivity tips. Over time it became Prody, and later Kairos. The project changed as I kept working on it.',
            'Today Kairos is a place to discover words, idioms, thoughts, quotes, and affirmations. There are letters to a future self, too. It has travelled a long way from a list of tasks, but it still carries the curiosity that started it.',
            'NEBians grew around a different need: a shared place for students and teachers to find notes, past papers, exam updates, and conversations. It lives on the web and Android, and continues to be shaped by the people who use it.',
            'Retra took me somewhere else again: Game Boy Advance emulation. It has its own engine, a patcher, and an original game called Mochi Hop. It is being built for homebrew and games people own.',
            'Looking back, I can see a path between these projects, even though I could not have drawn it at the beginning. Each one started with a question. Making it gave me another one to follow.',
        ],
    },
] as const;
