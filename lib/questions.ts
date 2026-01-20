import { Question } from './types';

export const questions: Question[] = [
  // Background Questions
  {
    id: 'experience_background',
    category: 'background',
    type: 'multiple-choice',
    question: 'Describe your professional background',
    description: 'Select the option that best represents your current career stage.',
    options: [
      { value: 'student', label: 'Student / New Graduate' },
      { value: 'early_career', label: 'Early Career (1-3 years)' },
      { value: 'mid_career', label: 'Mid-Career (4-10 years)' },
      { value: 'senior', label: 'Senior Professional (10+ years)' },
      { value: 'career_changer', label: 'Career Changer' },
    ],
    required: true,
  },
  {
    id: 'education_level',
    category: 'background',
    type: 'multiple-choice',
    question: "What's your highest level of education?",
    options: [
      { value: 'high_school', label: 'High School' },
      { value: 'some_college', label: 'Some College / Vocational' },
      { value: 'bachelors', label: "Bachelor's Degree" },
      { value: 'graduate', label: "Graduate Degree (Master's / PhD)" },
    ],
    required: true,
  },

  // Skills Questions
  {
    id: 'skill_strengths',
    category: 'skills',
    type: 'multi-select',
    question: 'Which are your strongest skills?',
    description: 'Select up to 2 skill areas.',
    options: [
      { value: 'technical', label: 'Technical / Analytical' },
      { value: 'communication', label: 'Communication' },
      { value: 'creative', label: 'Creative / Design' },
      { value: 'leadership', label: 'Leadership' },
      { value: 'research', label: 'Research' },
    ],
    required: true,
  },
  {
    id: 'field_of_study',
    category: 'skills',
    type: 'multiple-choice',
    question: 'What was your primary field of study?',
    description: 'Select the closest match to your major or area of focus.',
    options: [
      { value: 'computer_science', label: 'Computer Science / IT' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'business', label: 'Business / Management' },
      { value: 'finance_accounting', label: 'Finance / Accounting' },
      { value: 'healthcare_medicine', label: 'Healthcare / Medicine' },
      { value: 'science', label: 'Natural Sciences (Biology, Chemistry, Physics)' },
      { value: 'arts_humanities', label: 'Arts / Humanities' },
      { value: 'social_sciences', label: 'Social Sciences (Psychology, Sociology)' },
      { value: 'education', label: 'Education' },
      { value: 'law', label: 'Law / Legal Studies' },
      { value: 'design_media', label: 'Design / Media / Communications' },
      { value: 'trades_vocational', label: 'Trades / Vocational' },
      { value: 'other', label: 'Other / Not applicable' },
    ],
    required: true,
  },

  // Interests Questions
  {
    id: 'enjoyed_skills',
    category: 'interests',
    type: 'multi-select',
    question: 'Which skills do you most enjoy using at work?',
    description: 'Select up to 4 that you find most fulfilling.',
    options: [
      { value: 'problem_solving', label: 'Problem Solving' },
      { value: 'data_analysis', label: 'Data Analysis' },
      { value: 'writing', label: 'Writing & Documentation' },
      { value: 'presenting', label: 'Presenting & Public Speaking' },
      { value: 'design', label: 'Design & Visual Work' },
      { value: 'coding', label: 'Coding & Technical Work' },
      { value: 'leadership', label: 'Leadership & Management' },
      { value: 'negotiation', label: 'Negotiation & Sales' },
      { value: 'research', label: 'Research & Investigation' },
      { value: 'collaboration', label: 'Team Collaboration' },
      { value: 'teaching', label: 'Teaching & Mentoring' },
      { value: 'customer_service', label: 'Customer Service' },
      { value: 'hands_on_work', label: 'Hands-on & Manual Work' },
      { value: 'healthcare', label: 'Healthcare & Patient Care' },
      { value: 'styling', label: 'Styling & Aesthetics' },
      { value: 'legal_policy', label: 'Legal & Policy Analysis' },
      { value: 'scientific_lab', label: 'Scientific & Lab Work' },
      { value: 'event_planning', label: 'Event Planning & Coordination' },
    ],
    required: true,
  },
  {
    id: 'work_energizes',
    category: 'interests',
    type: 'multi-select',
    question: 'What type of work energizes you the most?',
    description: 'Select all that apply.',
    options: [
      { value: 'building', label: 'Building things from scratch' },
      { value: 'optimizing', label: 'Optimizing existing processes' },
      { value: 'helping', label: 'Helping and mentoring others' },
      { value: 'analyzing', label: 'Analyzing data and patterns' },
      { value: 'creating', label: 'Creating visual or written content' },
      { value: 'strategizing', label: 'Developing strategies and plans' },
      { value: 'connecting', label: 'Connecting with clients/customers' },
      { value: 'learning', label: 'Learning new technologies/methods' },
    ],
    required: true,
  },
  {
    id: 'problem_type',
    category: 'interests',
    type: 'multiple-choice',
    question: 'What type of problems do you prefer solving?',
    options: [
      { value: 'technical', label: 'Technical challenges (bugs, systems, architecture)' },
      { value: 'people', label: 'People challenges (team dynamics, communication)' },
      { value: 'business', label: 'Business challenges (growth, strategy, revenue)' },
      { value: 'creative', label: 'Creative challenges (design, user experience)' },
      { value: 'analytical', label: 'Analytical challenges (data, research, insights)' },
    ],
    required: true,
  },

  // Preferences Questions
  {
    id: 'industry_interest',
    category: 'preferences',
    type: 'multiple-choice',
    question: 'Which industry area interests you most?',
    options: [
      { value: 'technology_engineering', label: 'Technology & Engineering' },
      { value: 'business_management', label: 'Business, Management & Strategy' },
      { value: 'finance_accounting', label: 'Finance & Accounting' },
      { value: 'healthcare_life_sciences', label: 'Healthcare & Life Sciences' },
      { value: 'education_training', label: 'Education & Training' },
      { value: 'creative_media_design', label: 'Creative, Media & Design' },
      { value: 'marketing_sales', label: 'Marketing, Sales & Communication' },
      { value: 'law_government', label: 'Law, Government & Public Services' },
      { value: 'science_research', label: 'Science, Research & Data' },
      { value: 'manufacturing_construction', label: 'Manufacturing, Construction & Trades' },
      { value: 'hospitality_service', label: 'Hospitality, Travel & Service' },
      { value: 'social_impact_nonprofit', label: 'Social Impact, Non-Profit & Community' },
      { value: 'beauty_fashion', label: 'Beauty, Fashion & Lifestyle' },
      { value: 'other', label: 'Other (Sports, Entertainment, Agriculture, etc.)' },
    ],
    required: true,
  },
  {
    id: 'work_style',
    category: 'preferences',
    type: 'multiple-choice',
    question: 'What work style suits you best?',
    description: 'Consider environment, team dynamics, and structure.',
    options: [
      { value: 'independent', label: 'Independent / Flexible' },
      { value: 'collaborative', label: 'Collaborative / Team-oriented' },
      { value: 'structured', label: 'Structured / Corporate' },
      { value: 'dynamic', label: 'Dynamic / Startup' },
      { value: 'mission_driven', label: 'Mission-driven / Nonprofit' },
    ],
    required: true,
  },

  // Goals Question
  {
    id: 'career_priority',
    category: 'goals',
    type: 'multiple-choice',
    question: 'What matters most in your career?',
    description: 'Select your top priority.',
    options: [
      { value: 'compensation', label: 'High Compensation' },
      { value: 'balance', label: 'Work-Life Balance' },
      { value: 'growth', label: 'Growth & Learning' },
      { value: 'impact', label: 'Making an Impact' },
      { value: 'security', label: 'Job Security' },
    ],
    required: true,
  },
];

export const questionCategories = [
  { id: 'background', title: 'Background', icon: '/images/ex.png' },
  { id: 'skills', title: 'Skills', icon: '/images/skills.png' },
  { id: 'interests', title: 'Interests', icon: '/images/pre.png' },
  { id: 'preferences', title: 'Preferences', icon: '/images/pre.png' },
  { id: 'goals', title: 'Goals', icon: '/images/goal.png' },
] as const;

export function getQuestionsByCategory(category: string): Question[] {
  return questions.filter((q) => q.category === category);
}

export function getTotalQuestions(): number {
  return questions.length;
}
