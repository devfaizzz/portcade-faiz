// All content comes from Faiz_Resume_Fang.pdf. Fill the empty links when you have verified URLs.
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '')
export const profile = {
  name: 'FAIZ KHAN', email: 'faizk12312.fk@gmail.com', phone: '+91 7238052160',
  linkedin: 'https://linkedin.com/in/faizzkhann', github: 'https://github.com/devfaizzz',
  location: 'Prayagraj, Uttar Pradesh, India',
}
export type Project = { id: string; title: string; category: string; blurb: string; points: string[]; stack: string[]; live: string; source: string; flagship?: boolean; image?: string }
export const projects: Project[] = [
  { id: 'voiceup', image: asset('/images/projects/voiceup.png'), flagship: true, title: 'VoiceUp', category: 'AI-powered civic issue reporting & smart governance',
    blurb: 'A civic issue reporting platform with separate dashboards for citizens, contractors and administrators.',
    points: ['Llama 3.3 70B recommends contractors for each reported issue', 'Real-time complaint tracking with Socket.io', 'Role-based dashboards and issue management', 'Deployed on Render'],
    stack: ['Node.js', 'Express.js', 'MongoDB', 'Llama 3.3 70B', 'Socket.io'], live: '', source: '' },
  { id: 'career', image: asset('/images/projects/career.png'), title: 'AI Career Advisor Agent', category: 'Generative AI / agentic workflows',
    blurb: 'An agent that analyses a person’s skills, finds gaps and turns them into a structured roadmap.',
    points: ['Custom tool-calling for skill-gap analysis', 'Roadmap generation', 'Personalised project recommendations'],
    stack: ['Python', 'LangChain', 'Gemini'], live: '', source: '' },
  { id: 'gitdecodex', image: asset('/images/projects/gitdecodex.png'), title: 'GitDecodeX AI', category: 'AI developer tools',
    blurb: 'Reads a GitHub repository and summarises its structure, components and dependencies.',
    points: ['Codebase summaries from the GitHub API', 'Structure, components and dependency overview'],
    stack: ['Python', 'Llama', 'GitHub API'], live: '', source: '' },
  { id: 'llmopt', image: asset('/images/projects/llmopt.png'), title: 'LLMOpt', category: 'AI research / sustainable computing',
    blurb: 'Carbon-Aware Multi-LLM Optimization Framework. Estimates the carbon footprint and energy use of LLM inference.',
    points: ['Compares models on CO₂ emissions, energy, latency, token usage, quality and cost', 'Built for environment-conscious model selection'],
    stack: ['Python', 'LLM evaluation'], live: '', source: '' },
]
export const experience = [
  { org: 'SRJS Technologies Pvt. Ltd.', role: 'Software Development Intern', when: 'Jan 2026 – Jul 2026', where: 'Remote',
    items: ['Maintained backend and full-stack features for production systems with Node.js and Firebase; backend processing efficiency improved by approximately 80% (as stated in resume)', 'Built automations and WhatsApp chatbot integrations with n8n and Make.com'] },
  { org: 'SmartInternz & SkillBridge Pvt. Ltd.', role: 'Machine Learning Engineer Intern (Trainee)', when: 'Jul 2025 – Aug 2025', where: 'Remote',
    items: ['Built and deployed classification models with Python and Scikit-learn', 'Integrated them into an HTML/CSS/JavaScript frontend and a Flask REST API with a 5-member team'] },
  { org: 'United Global Infosoft Pvt. Ltd.', role: 'Full Stack Development Intern (Trainee)', when: 'Aug 2024 – Sep 2024', where: 'Prayagraj, India',
    items: ['Developed RESTful APIs with Node.js and Express.js', 'Configured and maintained development environments'] },
]
export const skills: Record<string, string[]> = {
  'Languages': ['Python', 'C++', 'Java', 'JavaScript', 'C', 'SQL'],
  'Core CS': ['Data Structures', 'STL', 'Collections', 'DBMS', 'OOP', 'Operating Systems', 'Computer Networks'],
  'Backend & frameworks': ['Node.js', 'Express.js', 'RESTful APIs', 'Tailwind CSS', 'FastAPI', 'Flask'],
  'Machine learning': ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
  'Generative AI': ['LLMs', 'Llama 3.3', 'Gemini', 'DeepSeek', 'Nemotron', 'LangChain', 'Agentic AI', 'Tool Calling'],
  'Databases': ['MySQL', 'MongoDB', 'MongoDB Atlas', 'Redis', 'Firebase'],
  'Tools & platforms': ['Git', 'GitHub', 'Docker', 'Postman', 'Socket.io', 'n8n', 'Make.com', 'crewAI', 'Google Colab'],
  'Methodologies': ['CI/CD', 'Microservices'],
}
export const achievements = [
  ['AWS Student Builder Campus Leader, 2026', 'One of 300 students selected nationwide from 10,000+ applicants'],
  ['Google Student Ambassador', '2026 campus cohort'],
  ['First Runner-Up: ArcticX Winter TechSprint', 'Organised by GDG AITD, Gandhinagar'],
  ['Second Runner-Up: UUHackDiwas ’26', 'National level, 300+ teams, ₹10,000 cash prize'],
  ['Top 5 Finalist: Hack18', 'NIT Allahabad'],
  ['Top 10 Grand Finale Finalist: Sankalp AI', 'NIT Allahabad (MNNIT)'],
  ['Smart India Hackathon 2024', 'Top 10 in the internal round'],
  ['Best Technical Implementation Winner: UHACK 4.0', ''],
]
export const community = ['Google Gen AI Exchange Bootcamp, Hyderabad', 'GDG Prayagraj', 'AKTU Zonal', 'Enigma XII & XIII (organizer)']
export const certs = ['5-Day AI Agents Course (Kaggle)', 'Machine Learning', 'IBM AI', 'Postman API', 'SPCWCS (MNNIT)', 'Python', 'Web Development']
// Project gallery (React Bits CircularCarousel). Add more images in public/images/gallery/ and list them here.
export const gallery = [
  { src: asset('/images/projects/voiceup.png'), alt: 'VoiceUp', title: 'VoiceUp', subtitle: 'Civic AI platform' },
  { src: asset('/images/projects/career.png'), alt: 'AI Career Advisor Agent', title: 'AI Career Advisor', subtitle: 'Agentic workflow' },
  { src: asset('/images/projects/gitdecodex.png'), alt: 'GitDecodeX AI', title: 'GitDecodeX AI', subtitle: 'Developer tools' },
  { src: asset('/images/projects/llmopt.png'), alt: 'LLMOpt', title: 'LLMOpt', subtitle: 'Carbon-aware LLMs' },
]
