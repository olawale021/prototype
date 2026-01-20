import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { careerPaths } from '@/lib/careers';
import { questions } from '@/lib/questions';
import { UserAnswers, CareerRecommendation } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (question.type === 'slider') {
      const value = Number(answer);
      const max = question.max || 10;
      let level = 'medium';
      if (value <= max * 0.33) level = 'LOW';
      else if (value >= max * 0.67) level = 'HIGH';
      else level = 'MEDIUM';

      answerText = `${value}/${max} (${level})`;
    } else if (question.type === 'multi-select') {
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
1. technology_engineering - Technology & Engineering: Software Engineer, Data Engineer, DevOps, IT Support, QA Engineer. Best for: strong technical/coding skills, enjoys building systems, prefers technical problem-solving
2. business_management - Business, Management & Strategy: Product Manager, Operations Manager, Consultant, Business Analyst. Best for: strong communication, strategic thinking, leadership, enjoys coordinating teams
3. finance_accounting - Finance & Accounting: Accountant, Financial Analyst, Investment Banker, Auditor. Best for: analytical skills, detail-oriented, enjoys numbers and financial analysis, prefers structure
4. healthcare_life_sciences - Healthcare & Life Sciences: Doctor, Nurse, Public Health Analyst, Biomedical Scientist. Best for: helping others, research interest, analytical, enjoys meaningful impact
5. education_training - Education & Training: Teacher, Lecturer, Instructional Designer, Corporate Trainer. Best for: communication skills, enjoys helping/teaching, patient, creative presentation
6. creative_media_design - Creative, Media & Design: Graphic Designer, UX Designer, Content Creator, Video Producer. Best for: high creative skills, enjoys design/visual work, flexible work style
7. marketing_sales - Marketing, Sales & Communication: Digital Marketer, Sales Executive, PR Manager, Growth Strategist. Best for: communication + creative skills, enjoys connecting with people, persuasion
8. law_government - Law, Government & Public Services: Lawyer, Policy Analyst, Civil Servant, Diplomat. Best for: research/writing skills, enjoys structure, analytical, ethics-driven
9. science_research - Science, Research & Data: Research Scientist, Data Scientist, Lab Analyst, Statistician. Best for: analytical skills, enjoys research/data, curious, detail-oriented
10. manufacturing_construction - Manufacturing, Construction & Trades: Civil Engineer, Architect, Electrician, Construction Manager. Best for: technical + hands-on skills, enjoys building tangible things
11. hospitality_service - Hospitality, Travel & Service: Hotel Manager, Event Planner, Travel Consultant, Customer Success. Best for: people skills, enjoys helping/connecting, service-oriented
12. social_impact_nonprofit - Social Impact, Non-Profit & Community: NGO Program Manager, Social Worker, Fundraising Manager. Best for: purpose-driven, enjoys helping others, community focus
13. beauty_fashion - Beauty, Fashion & Lifestyle: Fashion Designer, Stylist, Makeup Artist, Brand Buyer. Best for: high creative skills, eye for aesthetics, enjoys self-expression, people-oriented

CUSTOM INDUSTRIES: If the user selects "Other" for their industry interest or past experience, you SHOULD recommend custom industries that match their profile. Examples of custom industries:
- sports_fitness: Sports, Fitness & Recreation (Coach, Personal Trainer, Sports Manager, Athletic Director)
- entertainment_arts: Entertainment & Performing Arts (Actor, Producer, Talent Agent, Music Manager)
- agriculture_environment: Agriculture, Food & Environment (Agronomist, Food Scientist, Environmental Consultant)
- real_estate: Real Estate & Property (Real Estate Agent, Property Manager, Urban Planner)
- transportation_logistics: Transportation & Logistics (Supply Chain Manager, Fleet Manager, Logistics Coordinator)
- energy_utilities: Energy & Utilities (Energy Analyst, Sustainability Manager, Utility Engineer)

Use snake_case for custom industry IDs and provide full details (title, description, exampleJobs).

MATCHING RULES:
- Technical skills 8-10 + enjoys coding → technology_engineering or science_research
- Creative skills 8-10 + enjoys design → creative_media_design or marketing_sales
- Communication skills 8-10 + enjoys leadership → business_management or education_training
- Enjoys data analysis + analytical problems → science_research or finance_accounting
- Prefers nonprofit environment + helping others → social_impact_nonprofit or healthcare_life_sciences
- Prefers structured environment + detail-oriented → finance_accounting or law_government
- Enjoys building physical things + technical → manufacturing_construction
- Strong people skills + enjoys connecting → hospitality_service or marketing_sales

Respond with JSON containing "recommendations" array with exactly 3 matches:
- "careerId": industry id in snake_case (e.g., "technology_engineering") - use predefined IDs when possible, or create descriptive IDs for custom industries
- "title": display title for the industry (e.g., "Technology & Engineering")
- "description": brief description of the industry and what it involves
- "percentage": realistic match 60-95 based on how well they fit
- "reasons": 3-4 specific reasons referencing their actual answers
- "exampleJobs": array of 4-6 example job titles in this industry

Be specific! Reference their exact skill levels, preferences, and what energizes them.`;

    const userPrompt = `Analyze these assessment answers and recommend the top 3 careers that best match this person:

${formattedAnswers}

KEY INDICATORS TO CONSIDER:
- Skill levels (1-3 = low, 4-6 = medium, 7-10 = high)
- Skills they ENJOY using (most important for job satisfaction)
- What type of work ENERGIZES them
- Preferred problem type and industry
- Work environment and structure preferences

Return valid JSON only with your recommendations.`;

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
