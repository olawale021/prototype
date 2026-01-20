import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { careerPaths } from '@/lib/careers';
import { questions } from '@/lib/questions';
import { UserAnswers, CareerRecommendation } from '@/lib/types';

// Initialize OpenAI client lazily to avoid build-time errors
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const AVAILABLE_CAREERS = careerPaths.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
}));

function formatAnswersForPrompt(answers: UserAnswers): string {
  const formattedAnswers: string[] = [];

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) continue;

    let answerText: string;

    if (question.type === 'multi-select') {
      const values = answer as string[];
      const labels = values
        .map((v) => question.options?.find((o) => o.value === v)?.label || v)
        .join(', ');
      answerText = labels;
    } else if (question.type === 'multiple-choice') {
      const label = question.options?.find((o) => o.value === answer)?.label || String(answer);
      answerText = label;
    } else {
      answerText = String(answer);
    }

    formattedAnswers.push(`${question.question}: ${answerText}`);
  }

  return formattedAnswers.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const { answers } = (await request.json()) as { answers: UserAnswers };

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    const formattedAnswers = formatAnswersForPrompt(answers);

    const systemPrompt = `You are an expert career advisor AI. Analyze the user's assessment answers carefully and recommend the top 3 most suitable industry categories.

AVAILABLE INDUSTRIES (prefer these, but can recommend others if a better match exists):
1. technology_engineering - Technology & Engineering: Software Engineer, Data Engineer, DevOps, IT Support, QA Engineer. Best for: technical skill strength, enjoys coding/problem-solving, prefers technical challenges
2. business_management - Business, Management & Strategy: Product Manager, Operations Manager, Consultant, Business Analyst. Best for: communication + leadership skills, strategic work style, business challenges
3. finance_accounting - Finance & Accounting: Accountant, Financial Analyst, Investment Banker, Auditor. Best for: technical/analytical skills, structured work style, analytical challenges
4. healthcare_life_sciences - Healthcare & Life Sciences: Doctor, Nurse, Public Health Analyst, Biomedical Scientist. Best for: research skills, mission-driven style, enjoys healthcare/scientific work
5. education_training - Education & Training: Teacher, Lecturer, Instructional Designer, Corporate Trainer. Best for: communication skills, mission-driven style, enjoys teaching/presenting
6. creative_media_design - Creative, Media & Design: Graphic Designer, UX Designer, Content Creator, Video Producer. Best for: creative skill strength, independent style, creative challenges
7. marketing_sales - Marketing, Sales & Communication: Digital Marketer, Sales Executive, PR Manager, Growth Strategist. Best for: communication + creative skills, dynamic style, enjoys connecting/negotiation
8. law_government - Law, Government & Public Services: Lawyer, Policy Analyst, Civil Servant, Diplomat. Best for: research skills, structured style, people/analytical challenges
9. science_research - Science, Research & Data: Research Scientist, Data Scientist, Lab Analyst, Statistician. Best for: research + technical skills, enjoys data analysis/scientific work
10. manufacturing_construction - Manufacturing, Construction & Trades: Civil Engineer, Architect, Electrician, Construction Manager. Best for: technical skills, enjoys hands-on work/building
11. hospitality_service - Hospitality, Travel & Service: Hotel Manager, Event Planner, Travel Consultant, Customer Success. Best for: communication skills, collaborative style, enjoys customer service/events
12. social_impact_nonprofit - Social Impact, Non-Profit & Community: NGO Program Manager, Social Worker, Fundraising Manager. Best for: communication + leadership, mission-driven style, impact priority
13. beauty_fashion - Beauty, Fashion & Lifestyle: Fashion Designer, Stylist, Makeup Artist, Brand Buyer. Best for: creative skills, dynamic style, enjoys design/styling

CUSTOM INDUSTRIES: If the user selects "Other" for their industry interest, you SHOULD recommend custom industries that match their profile. Examples:
- sports_fitness: Sports, Fitness & Recreation (Coach, Personal Trainer, Sports Manager, Athletic Director)
- entertainment_arts: Entertainment & Performing Arts (Actor, Producer, Talent Agent, Music Manager)
- agriculture_environment: Agriculture, Food & Environment (Agronomist, Food Scientist, Environmental Consultant)
- real_estate: Real Estate & Property (Real Estate Agent, Property Manager, Urban Planner)
- transportation_logistics: Transportation & Logistics (Supply Chain Manager, Fleet Manager, Logistics Coordinator)
- energy_utilities: Energy & Utilities (Energy Analyst, Sustainability Manager, Utility Engineer)

Use snake_case for custom industry IDs and provide full details (title, description, exampleJobs).

MATCHING RULES (based on 10-question assessment):
- Technical skill strength + enjoys coding → technology_engineering or science_research
- Creative skill strength + enjoys design → creative_media_design or beauty_fashion
- Communication skill strength + leadership → business_management or education_training
- Research skill strength + enjoys data analysis → science_research or finance_accounting
- Mission-driven work style + impact priority → social_impact_nonprofit or healthcare_life_sciences
- Structured work style + security priority → finance_accounting or law_government
- Technical skills + enjoys hands-on work → manufacturing_construction
- Communication skills + dynamic style → hospitality_service or marketing_sales

Respond with JSON containing "recommendations" array with exactly 3 matches:
- "careerId": industry id in snake_case (e.g., "technology_engineering") - use predefined IDs when possible, or create descriptive IDs for custom industries
- "title": display title for the industry (e.g., "Technology & Engineering")
- "description": brief description of the industry and what it involves
- "percentage": realistic match 60-95 based on how well they fit
- "reasons": 3-4 specific reasons referencing their actual answers
- "exampleJobs": array of 4-6 example job titles in this industry

Be specific! Reference their skill strengths, enjoyed skills, work style, and career priorities.`;

    const userPrompt = `Analyze these assessment answers and recommend the top 3 careers that best match this person:

${formattedAnswers}

KEY INDICATORS TO CONSIDER:
- Skill strengths (technical, communication, creative, leadership, research)
- Skills they ENJOY using (most important for job satisfaction - they selected up to 4)
- What type of work ENERGIZES them
- Preferred problem type and industry interest
- Work style preference (independent, collaborative, structured, dynamic, mission-driven)
- Career priority (compensation, balance, growth, impact, security)

Return valid JSON only with your recommendations.`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(responseText) as {
      recommendations: Array<{
        careerId: string;
        title?: string;
        description?: string;
        percentage: number;
        reasons: string[];
        exampleJobs?: string[];
      }>;
    };

    // Map to full CareerRecommendation format using careerPaths data or AI-generated data
    const recommendations: CareerRecommendation[] = parsed.recommendations
      .map((rec) => {
        // Try to find predefined career first
        let career = careerPaths.find((c) => c.id === rec.careerId);

        // If not found, create a custom career from AI response
        if (!career) {
          career = {
            id: rec.careerId,
            title: rec.title || rec.careerId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            description: rec.description || `A career path in ${rec.careerId.replace(/_/g, ' ')}`,
            icon: '💼',
            weights: {},
            suggestedSkills: [],
            exampleJobs: rec.exampleJobs || [],
            resources: [],
          };
        }

        return {
          career,
          score: rec.percentage / 100,
          percentage: rec.percentage,
          reasons: rec.reasons.slice(0, 4),
        };
      })
      .filter((r): r is CareerRecommendation => r !== null);

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error('Recommendation API error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Failed to generate recommendations: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
