/**
 * Sample data for the four core science subjects.
 * Extend the platform by adding more subject objects or lessons.
 * Each lesson can include extra multimedia URLs or vocabulary items.
 */
export const subjects = [
  {
    id: 'english-for-science',
    title: 'English for Science',
    description:
      'Build academic English vocabulary, grammar, and communication skills that make natural science ideas easy to share.',
    heroImage:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80',
    color: 'from-brand-light to-brand',
    keywords: ['vocabulary', 'grammar', 'communication'],
    overview:
      'English is the core subject at SciBridge. These lessons explain how to read, write, and speak about experiments using confident academic language.',
    lessons: [
      {
        id: 'language-of-experiments',
        title: 'Language of Experiments',
        summary:
          'Practice verbs, sequence words, and cause-effect connectors that describe scientific investigations in English.',
        image:
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/xpJtXHQk-Jw',
        animationUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
        keyVocabulary: ['hypothesis', 'measure', 'therefore'],
        content: [
          'Use strong action verbs such as measure, observe, compare, and record when you describe each step of an experiment.',
          'Sequence words like first, next, then, and finally help readers follow the order of your procedure.',
          'Cause-and-effect connectors such as because, therefore, and as a result show how evidence supports your conclusions.'
        ]
      },
      {
        id: 'science-presentation-skills',
        title: 'Science Presentation Skills',
        summary: 'Learn phrases for giving clear, confident science presentations in English.',
        image:
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/w5p1Pbpclxs',
        animationUrl: 'https://media.giphy.com/media/3oEduNm0EmevTX8lIc/giphy.gif',
        keyVocabulary: ['evidence', 'explain', 'summarize'],
        content: [
          'Start presentations with an engaging hook: a question, a surprising fact, or a short story that links science and everyday life.',
          'Explain evidence in simple sentences before adding advanced vocabulary. Define new words the first time you use them.',
          'Summarize key ideas at the end and invite questions using phrases such as “Would you like me to clarify any step?”'
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description:
      'Strengthen algebra, geometry, and trigonometry skills with clear bilingual explanations for every grade level.',
    heroImage:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1600&q=80',
    color: 'from-sky-100 to-sky-300',
    keywords: ['algebra', 'geometry', 'trigonometry'],
    overview:
      'Build confidence across Grades 10, 11, and 12 with structured practice and teacher-guided notes for each math topic.',
    lessons: [
      {
        id: 'grade-10-math',
        title: 'Grade 10 Mathematics',
        summary: 'Core algebra foundations with space for teacher-uploaded examples and practice sets.',
        image:
          'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['linear equations', 'functions', 'proof'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 10.']
      },
      {
        id: 'grade-11-math',
        title: 'Grade 11 Mathematics',
        summary: 'Advanced algebra and geometry modules with placeholders for administrator content.',
        image:
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['quadratics', 'vectors', 'transformations'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 11.']
      },
      {
        id: 'grade-12-math',
        title: 'Grade 12 Mathematics',
        summary: 'Exam-focused trigonometry and calculus prep ready for admins to populate with lessons.',
        image:
          'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['trigonometry', 'limits', 'derivatives'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 12.']
      }
    ]
  },
  {
    id: 'physics',
    title: 'Physics',
    description:
      'Extension: Apply your English skills to explore how matter, energy, motion, and forces connect in the universe.',
    heroImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    color: 'from-brand-light to-brand',
    keywords: ['motion', 'energy', 'force', 'waves'],
    overview:
      'Extend your English for Science skills by exploring motion, energy, waves, and technology with clear visuals.',
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
    id: 'information-technology',
    title: 'Information Technology',
    description:
      'Learn programming, networking, and digital literacy with short bilingual notes ready for teacher uploads.',
    heroImage:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80',
    color: 'from-fuchsia-100 to-fuchsia-300',
    keywords: ['coding', 'networking', 'digital citizenship'],
    overview:
      'Follow three grade bands with space for admin-added videos, slides, and hands-on IT projects.',
    lessons: [
      {
        id: 'grade-10-it',
        title: 'Grade 10 IT',
        summary: 'Introductory coding and hardware basics with placeholders for classroom resources.',
        image:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['algorithm', 'binary', 'hardware'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 10.']
      },
      {
        id: 'grade-11-it',
        title: 'Grade 11 IT',
        summary: 'Networking, databases, and web foundations awaiting admin-provided practice tasks.',
        image:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['network', 'database', 'protocol'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 11.']
      },
      {
        id: 'grade-12-it',
        title: 'Grade 12 IT',
        summary: 'Software development projects and cybersecurity topics ready for admin uploads.',
        image:
          'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['cybersecurity', 'debugging', 'deployment'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 12.']
      }
    ]
  },
  {
    id: 'chemistry',
    title: 'Chemistry (Extension)',
    description: 'Extension: Use academic English to describe matter, reactions, and how substances change and combine.',
    heroImage:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80',
    color: 'from-emerald-100 to-emerald-400',
    keywords: ['atoms', 'molecules', 'reactions'],
    overview:
      'Extend your vocabulary while discovering the building blocks of matter, chemical reactions, and the periodic table.',
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
    title: 'Biology (Extension)',
    description: 'Extension: Strengthen English reading and writing while exploring living things and ecosystems.',
    heroImage:
      'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1600&q=80',
    color: 'from-rose-100 to-rose-300',
    keywords: ['cells', 'ecosystems', 'body systems'],
    overview:
      'Extend your English writing and reading by studying cells, body systems, and ecosystems with friendly explanations.',
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
    title: 'Earth Science (Extension)',
    description: 'Extension: Use English to explain our planet, rocks, weather, climate, and space phenomena.',
    heroImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    color: 'from-indigo-100 to-indigo-400',
    keywords: ['geology', 'weather', 'climate'],
    overview:
      'Extend your English comprehension as you explore the dynamic Earth, weather patterns, and the solar system.',
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
  },
  {
    id: 'vietnamese-language',
    title: 'Vietnamese Language',
    description:
      'Practice phonetics, reading, and grammar with admin-curated stories and exercises for every upper-secondary grade.',
    heroImage:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80',
    color: 'from-amber-100 to-amber-300',
    keywords: ['phonetics', 'reading', 'grammar'],
    overview:
      'Each grade band includes placeholders where administrators can add texts, audio clips, and writing prompts.',
    lessons: [
      {
        id: 'grade-10-vietnamese',
        title: 'Khối 10 - Tiếng Việt',
        summary: 'Nền tảng phát âm và đọc hiểu, sẵn sàng để admin tải lên ví dụ và bài tập.',
        image:
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['ngữ âm', 'từ vựng', 'đọc hiểu'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 10.']
      },
      {
        id: 'grade-11-vietnamese',
        title: 'Khối 11 - Tiếng Việt',
        summary: 'Ngữ pháp nâng cao và luyện viết với chỗ trống cho tài liệu do admin cung cấp.',
        image:
          'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['ngữ pháp', 'phong cách', 'thuyết minh'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 11.']
      },
      {
        id: 'grade-12-vietnamese',
        title: 'Khối 12 - Tiếng Việt',
        summary: 'Ôn luyện tổng hợp với khung bài viết và đề tài sẽ được admin cập nhật.',
        image:
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        animationUrl: '',
        keyVocabulary: ['phân tích', 'lập luận', 'diễn đạt'],
        content: ['Nội dung sẽ được admin bổ sung cho khối lớp 12.']
      }
    ]
  }
];

export const allLessons = subjects.flatMap((subject) =>
  subject.lessons.map((lesson) => ({ ...lesson, subjectId: subject.id, subjectTitle: subject.title }))
);
