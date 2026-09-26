export const site = {
  name: 'Justin Koida',
  about: 'My work spans machine learning, data analysis, and web development, with internship and research experience in telemetry analysis, model evaluation, and decision-support tools.',
  captainLog: {
    introduction: 'I’m Justin Koida. I build machine learning and web applications, with a background in computer science and statistics at Cal Poly, San Luis Obispo.',
    background: 'My experience ranges from analyzing large-scale customer telemetry at HPE to running model experiments at RooGenAI, researching medical school applicant selection at Cal Poly SURP, and building React interfaces at Spread Goodness.',
    projects: 'My projects bring those areas together: Campus Compass combines web development and recommendation systems, while Mahjong Shifu explores real-time computer vision.',
    focus: ['Machine learning', 'Data analysis', 'Web development'],
    profiles: [
      { name: 'GitHub', description: 'Code & repositories', url: '' },
      { name: 'LinkedIn', description: 'Professional background', url: 'https://www.linkedin.com/in/justin-koida/' },
    ],
    chess: { title: 'Away from the helm', description: 'A space for my Chess.com profile.', url: '' },
  },
  timeline: [
    {
      organization: 'Hewlett Packard Enterprise (HPE)',
      role: 'AI/ML Intern',
      period: 'Jun. 2026 – Sep. 2026',
      highlights: [
        'Built a PySpark notebook processing telemetry across tens of thousands of customer environments.',
        'Engineered customer-level features from hundreds of thousands of devices and evaluated clustering methods to identify behavioral patterns across customer segments.',
      ],
    },
    {
      organization: 'RooGenAI',
      role: 'Machine Learning Research Intern',
      period: 'Dec. 2025 – Jun. 2026',
      highlights: [
        'Designed and executed more than 10 controlled experiments to evaluate model hyperparameters and configuration changes.',
        'Developed Python notebooks to automate experiment analysis and compare model performance across training configurations.',
        'Modified model implementation and configured evaluation flags to support custom model behavior and experiment outputs.',
      ],
    },
    {
      organization: 'Cal Poly SURP',
      role: 'Undergraduate Machine Learning Researcher',
      period: 'Jun. 2024 – Sep. 2024',
      highlights: [
        'Designed a custom linear optimization model that balanced multiple prediction targets to generate interpretable feature weights for medical school applicant ranking.',
        'Built a Power BI decision-support tool to evaluate and prioritize more than 10,000 applicants, and developed and evaluated five multiclass classification models.',
        'Co-authored and presented “Developing a Predictive Model for Medical School Applicant Selection” at the IISE Annual Conference 2025; published in the conference proceedings.',
      ],
    },
    {
      organization: 'Spread Goodness®',
      role: 'Web Developer Intern',
      period: 'Mar. 2024 – Sep. 2024',
      highlights: [
        'Translated Figma designs into reusable React components, including buttons, information cards, and interface elements.',
        'Built an interactive tutorial flow to guide users through application features and workflows.',
      ],
    },
  ],
  projects: [
    {
      name: 'Campus Compass',
      slug: 'campus-compass',
      technologies: 'React · Python · Supabase · SentenceTransformers',
      summary: 'A web application for personalized discovery across more than 300 student organizations.',
      highlights: [
        'Built a matching algorithm combining more than 40 club attributes, user preferences, and semantic representations of club descriptions.',
        'Designed the Supabase relational schema for club, user, and recommendation data.',
      ],
      link: { label: 'Visit Campus Compass', url: 'https://campuscompass.dev' },
    },
    {
      name: 'Mahjong Shifu',
      slug: 'mahjong-shifu',
      technologies: 'Python · YOLO · OpenCV · Computer Vision',
      summary: 'A real-time webcam application that detects and classifies Mahjong tiles.',
      highlights: [
        'Created and manually labeled a training dataset, then trained a YOLO model to classify approximately 60 tile classes, achieving 0.967 mAP@0.5.',
        'Improved model performance through data augmentation, prediction-driven error analysis, label refinement, and retraining.',
      ],
    },
  ],
}
