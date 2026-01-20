import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { InterviewQuestion } from '@/lib/interview-types';
import {
  GENERATE_QUESTIONS_SYSTEM_PROMPT,
  GENERATE_QUESTIONS_USER_PROMPT,
} from '@/lib/interview-prompts';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(
    `generate-questions:${clientIp}`,
    RATE_LIMITS.generateQuestions
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Please try again in ${rateLimitResult.resetIn} seconds.`,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimitResult.resetIn),
        },
      }
    );
  }

  try {
    const { jobDescription, resumeText, count = 12 } = await request.json();

    if (!jobDescription || !resumeText) {
      return NextResponse.json(
        { error: 'Job description and resume text are required' },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: GENERATE_QUESTIONS_SYSTEM_PROMPT },
        {
          role: 'user',
          content: GENERATE_QUESTIONS_USER_PROMPT(jobDescription, resumeText, count),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(responseText) as {
      questions: Array<{
        id?: string;
        text: string;
        category: 'behavioral' | 'technical' | 'situational';
        context?: string;
        skillsAssessed?: string[];
      }>;
    };

    // Ensure all questions have valid IDs and structure
    const questions: InterviewQuestion[] = parsed.questions.map((q) => ({
      id: q.id || uuidv4(),
      text: q.text,
      category: q.category,
      context: q.context,
      skillsAssessed: q.skillsAssessed,
    }));

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Generate questions error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Failed to generate questions: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
