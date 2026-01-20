export interface StudyResource {
  id: string;
  title: string;
  description: string;
  category: 'method' | 'questions' | 'tips';
  content: string[];
  examples?: Array<{
    scenario: string;
    answer: string;
  }>;
}

export const studyResources: StudyResource[] = [
  {
    id: 'star-method',
    title: 'The STAR Method',
    description: 'A structured approach for answering behavioral interview questions',
    category: 'method',
    content: [
      '**Situation**: Set the scene and give context. Describe the circumstances, your role, and what was at stake.',
      '**Task**: Explain your specific responsibility. What was your role? What were you asked to do?',
      '**Action**: Describe the specific actions YOU took. Focus on your contributions, not the team\'s.',
      '**Result**: Share the outcome. Use metrics and specific achievements whenever possible.',
    ],
    examples: [
      {
        scenario: '"Tell me about a time you had to meet a tight deadline."',
        answer:
          '**Situation**: At my previous company, we had a major client presentation scheduled for Monday, but our lead designer fell ill on Thursday.\n\n**Task**: As the senior designer, I was asked to completely revamp the 40-slide presentation over the weekend while maintaining our brand guidelines.\n\n**Action**: I prioritized the most impactful slides first, created a reusable template to speed up production, and worked closely with the account manager to understand key messaging. I also brought in a junior designer to help with graphics.\n\n**Result**: We delivered the presentation on time, and it helped close a $500K contract. The client specifically mentioned the visual quality as a deciding factor.',
      },
    ],
  },
  {
    id: 'common-behavioral',
    title: 'Common Behavioral Questions',
    description: 'Prepare for the most frequently asked behavioral questions',
    category: 'questions',
    content: [
      '"Tell me about a time you failed and what you learned."',
      '"Describe a situation where you had to work with a difficult colleague."',
      '"Give an example of a goal you set and how you achieved it."',
      '"Tell me about a time you had to persuade someone to see your point of view."',
      '"Describe a situation where you had to make a decision with incomplete information."',
      '"Tell me about a time you went above and beyond."',
      '"Give an example of how you handled a stressful situation."',
      '"Describe a time when you had to adapt to change quickly."',
    ],
  },
  {
    id: 'common-technical',
    title: 'Technical Interview Tips',
    description: 'How to approach technical and skill-based questions',
    category: 'tips',
    content: [
      '**Think Aloud**: Verbalize your thought process. Interviewers want to see how you approach problems.',
      '**Clarify First**: Ask questions to understand the problem before diving into solutions.',
      "**Start Simple**: Begin with a basic solution, then optimize. Don't jump to the most complex approach.",
      "**Admit Gaps**: It's okay to say you don't know something. Show how you'd learn it.",
      '**Use Concrete Examples**: Reference specific tools, technologies, or methodologies you\'ve used.',
      '**Discuss Trade-offs**: Show you understand pros and cons of different approaches.',
    ],
  },
  {
    id: 'situational-tips',
    title: 'Situational Question Strategies',
    description: 'How to handle hypothetical scenario questions',
    category: 'tips',
    content: [
      '**Show Your Process**: Walk through how you\'d approach the situation step by step.',
      '**Consider Stakeholders**: Think about who would be affected by your decisions.',
      '**Prioritize**: If the scenario involves multiple issues, explain how you\'d prioritize.',
      '**Ask Clarifying Questions**: It\'s okay to ask for more details about the hypothetical scenario.',
      '**Draw from Experience**: Even for hypotheticals, reference similar real situations you\'ve handled.',
      '**Think Long-term**: Consider both immediate actions and long-term implications.',
    ],
  },
  {
    id: 'general-tips',
    title: 'General Interview Tips',
    description: 'Best practices for interview success',
    category: 'tips',
    content: [
      '**Research the Company**: Understand their products, culture, recent news, and challenges.',
      '**Prepare Questions**: Have thoughtful questions ready to ask the interviewer.',
      '**Practice Out Loud**: Rehearse answers verbally, not just in your head.',
      '**Quantify Achievements**: Use numbers and metrics whenever possible (e.g., "increased sales by 25%").',
      '**Be Specific**: Avoid vague answers. Provide concrete examples and details.',
      '**Show Enthusiasm**: Genuine interest in the role makes a strong impression.',
      '**Follow Up**: Send a thank-you email within 24 hours of the interview.',
      '**Manage Nerves**: Take deep breaths, pause before answering, and remember it\'s a conversation.',
    ],
  },
  {
    id: 'questions-to-ask',
    title: 'Questions to Ask Interviewers',
    description: 'Smart questions that demonstrate your interest and insight',
    category: 'questions',
    content: [
      '"What does success look like in this role in the first 90 days?"',
      '"How would you describe the team culture?"',
      '"What are the biggest challenges facing the team right now?"',
      '"How does this role contribute to the company\'s goals?"',
      '"What do you enjoy most about working here?"',
      '"What opportunities are there for growth and development?"',
      '"How is performance typically measured and reviewed?"',
      '"What\'s the next step in the interview process?"',
    ],
  },
];

export const categoryInfo = {
  method: {
    title: 'Methods & Frameworks',
    description: 'Structured approaches for answering questions',
    icon: '📋',
  },
  questions: {
    title: 'Common Questions',
    description: 'Frequently asked interview questions to prepare for',
    icon: '❓',
  },
  tips: {
    title: 'Tips & Strategies',
    description: 'Best practices and strategies for interview success',
    icon: '💡',
  },
};
