export const EVENT = {
  id: 'EVT-2025-NOVA',
  name: 'TechNova 2025',
  tagline: 'Where Innovation Meets Excellence',
  department: 'Department of Computer Science & Engineering',
  college: 'Sri Venkateswara College of Engineering',
  date: 'Saturday, May 24, 2025',
  time: '9:00 AM – 6:00 PM',
  venue: 'Main Auditorium, Block A, Ground Floor',
  price: 299,
  totalTickets: 200,
  description:
    'TechNova is the flagship annual technical fest of SVCE. Open to ALL students — inside and outside campus. Pay the entry fee, attend the fest, and register for up to 3 competitions of your choice!',
  highlights: [
    { icon: '🎤', label: 'Industry Keynotes', desc: '8+ expert speakers from top companies' },
    { icon: '💻', label: 'Live Hackathon', desc: '6-hour coding marathon with prizes' },
    { icon: '🤖', label: 'Robotics Expo', desc: '20+ innovative robotics projects' },
    { icon: '🔬', label: 'Project Showcase', desc: 'Display your innovation to judges' },
    { icon: '🏆', label: '₹1L+ Prizes', desc: 'Across all competitions combined' },
    { icon: '🍕', label: 'Free Lunch', desc: 'Included for all registered attendees' },
    { icon: '🎮', label: 'Gaming Zone', desc: 'Esports & casual gaming tournaments' },
    { icon: '📜', label: 'Certificates', desc: 'For all participants & winners' },
  ],
  schedule: [
    { time: '9:00 AM',  event: 'Registration & Welcome Kit', desc: 'Collect your badge, T-shirt and kit' },
    { time: '10:00 AM', event: 'Inauguration Ceremony',      desc: 'Chief Guest: Dr. Arun Kumar, CTO @ TechCorp India' },
    { time: '11:00 AM', event: 'Keynote: AI & The Future',   desc: 'Ms. Priya Nair, Google DeepMind' },
    { time: '12:30 PM', event: 'Hackathon Kickoff',          desc: '6-hour coding marathon — 50 teams' },
    { time: '2:00 PM',  event: 'Workshop: React + Cloud',    desc: 'Hands-on session — limited seats' },
    { time: '4:00 PM',  event: 'Project Expo & Judging',     desc: 'Display your innovation to industry panel' },
    { time: '5:30 PM',  event: 'Prize Distribution',         desc: 'Awards, certificates & closing ceremony' },
  ],
  gallery: [
    { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80', caption: 'Opening Ceremony 2024', span: 'main' },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', caption: 'Hackathon Floor' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', caption: 'Robotics Showcase' },
    { url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80', caption: 'Workshop Session' },
    { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80', caption: 'Project Expo' },
    { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80', caption: 'Closing Ceremony' },
  ],
};

// All competitions available to register (max 3 per attendee)
export const COMPETITIONS = [
  { id: 'COMP-HACK',    name: 'Hackathon',          category: 'Technical',     maxTeam: 4, prize: '₹30,000', desc: '6-hour coding challenge. Build anything innovative.' },
  { id: 'COMP-ROBO',    name: 'RoboWars',           category: 'Technical',     maxTeam: 3, prize: '₹20,000', desc: 'Build and battle robots in the arena.' },
  { id: 'COMP-ESPORTS', name: 'Esports (BGMI)',     category: 'Gaming',        maxTeam: 4, prize: '₹15,000', desc: 'Battle Grounds Mobile India team tournament.' },
  { id: 'COMP-COOK',    name: 'Cooking Challenge',  category: 'Cultural',      maxTeam: 2, prize: '₹10,000', desc: 'Mystery ingredient cooking competition.' },
  { id: 'COMP-SING',    name: 'Solo Singing',       category: 'Cultural',      maxTeam: 1, prize: '₹8,000',  desc: 'Showcase your vocal talent on the main stage.' },
  { id: 'COMP-DANCE',   name: 'Dance Battle',       category: 'Cultural',      maxTeam: 6, prize: '₹12,000', desc: 'Group or solo dance performance competition.' },
  { id: 'COMP-QUIZ',    name: 'Tech Quiz',          category: 'Technical',     maxTeam: 2, prize: '₹6,000',  desc: 'General tech knowledge & current affairs quiz.' },
  { id: 'COMP-PAPER',   name: 'Paper Presentation', category: 'Academic',      maxTeam: 2, prize: '₹8,000',  desc: 'Present your research paper to an expert panel.' },
  { id: 'COMP-PHOTO',   name: 'Photography',        category: 'Creative',      maxTeam: 1, prize: '₹5,000',  desc: 'Campus & event photography contest.' },
  { id: 'COMP-CHESS',   name: 'Chess Tournament',   category: 'Sports',        maxTeam: 1, prize: '₹4,000',  desc: 'Swiss-system chess tournament open to all.' },
  { id: 'COMP-DEBATE',  name: 'Debate',             category: 'Academic',      maxTeam: 2, prize: '₹6,000',  desc: 'Interschool debate on current tech & social topics.' },
  { id: 'COMP-FIFA',    name: 'FIFA Tournament',    category: 'Gaming',        maxTeam: 1, prize: '₹5,000',  desc: 'FIFA console tournament, 1v1 knockout rounds.' },
];

export const COMP_CATEGORIES = ['All', 'Technical', 'Cultural', 'Gaming', 'Academic', 'Creative', 'Sports'];

export const INITIAL_BOOKINGS = [
  { id: 'TN-001', name: 'Arjun Mehta',  email: 'arjun@svce.ac.in',  dept: 'CSE',  qty: 2, total: 598,  status: 'confirmed', date: '2025-04-01', competitions: ['COMP-HACK','COMP-ROBO','COMP-QUIZ'] },
  { id: 'TN-002', name: 'Priya Sharma', email: 'priya@svce.ac.in',  dept: 'ECE',  qty: 1, total: 299,  status: 'confirmed', date: '2025-04-02', competitions: ['COMP-SING','COMP-DANCE'] },
  { id: 'TN-003', name: 'Rohan Das',    email: 'rohan@svce.ac.in',  dept: 'IT',   qty: 3, total: 897,  status: 'confirmed', date: '2025-04-03', competitions: ['COMP-HACK','COMP-ESPORTS','COMP-FIFA'] },
  { id: 'TN-004', name: 'Sneha Reddy',  email: 'sneha@svce.ac.in',  dept: 'MECH', qty: 1, total: 299,  status: 'confirmed', date: '2025-04-04', competitions: ['COMP-COOK','COMP-PHOTO'] },
  { id: 'TN-005', name: 'Vikram Singh', email: 'vikram@svce.ac.in', dept: 'CSE',  qty: 4, total: 1196, status: 'confirmed', date: '2025-04-05', competitions: ['COMP-HACK','COMP-ROBO','COMP-CHESS'] },
  { id: 'TN-006', name: 'Ananya Iyer',  email: 'ananya@svce.ac.in', dept: 'EEE',  qty: 2, total: 598,  status: 'cancelled', date: '2025-04-06', competitions: [] },
  { id: 'TN-007', name: 'Karthik Raja', email: 'karthik@svce.ac.in',dept: 'CSE',  qty: 1, total: 299,  status: 'confirmed', date: '2025-04-07', competitions: ['COMP-DEBATE','COMP-PAPER'] },
  { id: 'TN-008', name: 'Divya Nair',   email: 'divya@svce.ac.in',  dept: 'MBA',  qty: 2, total: 598,  status: 'confirmed', date: '2025-04-08', competitions: ['COMP-DANCE','COMP-SING','COMP-COOK'] },
];

export const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA', 'Faculty', 'Other'];

export const EVENTS_LIST = [
  { id: 'EVT-2025-NOVA', name: 'TechNova 2025',   dept: 'CSE', date: '2025-05-24', venue: 'Main Auditorium', price: 299, capacity: 200, sold: 16, status: 'active' },
  { id: 'EVT-2025-CODE', name: 'CodeSprint 2025', dept: 'IT',  date: '2025-06-10', venue: 'Seminar Hall B',  price: 149, capacity: 100, sold: 43, status: 'active' },
  { id: 'EVT-2025-ROBO', name: 'RoboWars 2025',   dept: 'ECE', date: '2025-06-22', venue: 'Lab Block 3',     price: 399, capacity: 60,  sold: 28, status: 'active' },
  { id: 'EVT-2025-DATA', name: 'DataHack 2025',   dept: 'CSE', date: '2025-07-05', venue: 'Auditorium A',   price: 199, capacity: 150, sold: 0,  status: 'upcoming' },
];
