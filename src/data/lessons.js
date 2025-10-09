/**
 * Sample data for the four core science subjects.
 * Extend the platform by adding more subject objects or lessons.
 * Each lesson can include extra multimedia URLs or vocabulary items.
 */
export const subjects = [
  {
    id: 'physics',
    title: 'Physics',
    description:
      'Physics helps us understand how matter, energy, motion, and forces work together in the universe.',
    heroImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    color: 'from-brand-light to-brand',
    keywords: ['motion', 'energy', 'force', 'waves'],
    overview:
      'Learn about motion, energy, waves, and technology using clear English words and helpful visuals.',
    lessons: [
      {
        id: 'newton-laws',
        title: "Newton's Laws of Motion",
        summary: 'Understand how objects move and how forces change their motion using simple examples.',
        image:
          'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds',
        animationUrl: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
        keyVocabulary: ['inertia', 'acceleration', 'force'],
        content: [
          'Newton described three rules for motion. A rule is like a law in science. These laws help us predict how objects move.',
          'First Law: Objects keep doing what they are doing unless a force changes them. This is called inertia.',
          'Second Law: A stronger force makes more acceleration. If mass is bigger, it needs more force to move.',
          'Third Law: For every action, there is an equal and opposite reaction. Forces come in pairs.'
        ]
      },
      {
        id: 'energy-forms',
        title: 'Forms of Energy',
        summary: 'Explore different types of energy such as kinetic, potential, thermal, and electrical energy.',
        image:
          'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/yL6hADa-8Ws',
        animationUrl: 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
        keyVocabulary: ['kinetic energy', 'potential energy', 'thermal'],
        content: [
          'Energy is the ability to do work or cause change. It cannot be created or destroyed, only transformed.',
          'Kinetic energy is the energy of motion. Potential energy is stored energy, like a book on a shelf.',
          'Thermal energy is the energy of moving particles. Electrical energy travels in wires and powers lights.'
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'Chemistry looks at matter, reactions, and how different substances change and combine.',
    heroImage:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80',
    color: 'from-emerald-100 to-emerald-400',
    keywords: ['atoms', 'molecules', 'reactions'],
    overview:
      'Discover the building blocks of matter, chemical reactions, and the periodic table in student-friendly English.',
    lessons: [
      {
        id: 'atomic-structure',
        title: 'Inside the Atom',
        summary: 'Meet protons, neutrons, and electrons. See how they form atoms and different elements.',
        image:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/YNSxNsr4wmA',
        animationUrl: 'https://media.giphy.com/media/xT5LMzIK1AdZJbVSSg/giphy.gif',
        keyVocabulary: ['proton', 'neutron', 'electron'],
        content: [
          'An atom has a center called a nucleus. The nucleus has protons with positive charge and neutrons with no charge.',
          'Electrons are tiny particles with negative charge. They move around the nucleus in energy levels.',
          'Different atoms have different numbers of protons. The number of protons decides which element it is.'
        ]
      },
      {
        id: 'chemical-reactions',
        title: 'Chemical Reactions',
        summary: 'Learn how substances change into new substances by breaking and forming chemical bonds.',
        image:
          'https://images.unsplash.com/photo-1581092787767-8a486a6bf17e?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/Jnzzv3MyLyc',
        animationUrl: 'https://media.giphy.com/media/3osxYdXKQ9f47ZxYqk/giphy.gif',
        keyVocabulary: ['reactant', 'product', 'conservation'],
        content: [
          'In a chemical reaction, reactants change into products. The atoms are rearranged but not destroyed.',
          'Signs of a reaction can include color change, temperature change, gas bubbles, or a new solid.',
          'The mass of the reactants equals the mass of the products. This is the law of conservation of mass.'
        ]
      }
    ]
  },
  {
    id: 'biology',
    title: 'Biology',
    description: 'Biology explores living things, how they grow, and how they interact with the environment.',
    heroImage:
      'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1600&q=80',
    color: 'from-rose-100 to-rose-300',
    keywords: ['cells', 'ecosystems', 'body systems'],
    overview:
      'Study cells, body systems, and ecosystems with clear explanations that support English language learning.',
    lessons: [
      {
        id: 'cell-structure',
        title: 'Cells Are the Basic Unit of Life',
        summary: 'Examine plant and animal cells, including organelles that help the cell live and work.',
        image:
          'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/URUJD5NEXC8',
        animationUrl: 'https://media.giphy.com/media/3oEduSbSGpGaRX2Vri/giphy.gif',
        keyVocabulary: ['nucleus', 'membrane', 'chloroplast'],
        content: [
          'All living things are made of cells. Cells have special parts called organelles that help them do jobs.',
          'The nucleus controls the cell. The cell membrane protects the cell. Plant cells have chloroplasts for photosynthesis.',
          'Cells work together to make tissues, organs, and systems in living organisms.'
        ]
      },
      {
        id: 'ecosystems',
        title: 'Ecosystems and Energy Flow',
        summary: 'See how producers, consumers, and decomposers form food chains and webs in ecosystems.',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/-5Y6jFbG8xI',
        animationUrl: 'https://media.giphy.com/media/d31w24psGYeekCZy/giphy.gif',
        keyVocabulary: ['producer', 'consumer', 'decomposer'],
        content: [
          'An ecosystem includes all the living and non-living things in an area. Each part is connected.',
          'Producers make energy-rich food using sunlight. Consumers eat plants or animals. Decomposers break down dead matter.',
          'Energy flows from the sun to producers and then to consumers. Food webs show the many feeding connections.'
        ]
      }
    ]
  },
  {
    id: 'earth-science',
    title: 'Earth Science',
    description: 'Earth Science studies our planet, including rocks, weather, climate, and space.',
    heroImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    color: 'from-indigo-100 to-indigo-400',
    keywords: ['geology', 'weather', 'climate'],
    overview:
      'Explore the dynamic Earth, weather patterns, and the solar system with easy-to-understand lessons.',
    lessons: [
      {
        id: 'rock-cycle',
        title: 'The Rock Cycle',
        summary: 'Learn how rocks change from one type to another through melting, cooling, weathering, and pressure.',
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/GV0H4bB1W5E',
        animationUrl: 'https://media.giphy.com/media/3o6fJ6v0aDUZRFyYsg/giphy.gif',
        keyVocabulary: ['igneous', 'sedimentary', 'metamorphic'],
        content: [
          'Rocks are always changing in the rock cycle. Heat, pressure, and weather shape them.',
          'Igneous rocks form from cooled magma. Sedimentary rocks form from layers of small pieces. Metamorphic rocks change under heat and pressure.',
          'The rock cycle has no start or end. Rocks can move through different stages many times.'
        ]
      },
      {
        id: 'weather-climate',
        title: 'Weather vs. Climate',
        summary: 'Understand the difference between daily weather and long-term climate patterns.',
        image:
          'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/vH298zSCQzY',
        animationUrl: 'https://media.giphy.com/media/l0HlTrZJzQMcafAMY/giphy.gif',
        keyVocabulary: ['temperature', 'precipitation', 'climate change'],
        content: [
          'Weather describes short-term conditions like temperature, wind, and rain. Climate describes average weather over many years.',
          'Climate zones can be tropical, temperate, or polar. They depend on latitude and other factors.',
          'Climate change happens when long-term patterns shift. Human activities can speed up these changes.'
        ]
      }
    ]
  }
];

export const allLessons = subjects.flatMap((subject) =>
  subject.lessons.map((lesson) => ({ ...lesson, subjectId: subject.id, subjectTitle: subject.title }))
);
