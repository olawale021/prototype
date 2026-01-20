import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AnswerFeedback } from '@/lib/interview-types';
import {
  EVALUATE_ANSWER_SYSTEM_PROMPT,
  EVALUATE_ANSWER_USER_PROMPT,
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
    `evaluate-answer:${clientIp}`,
    RATE_LIMITS.evaluateAnswer
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
    const { question, questionCategory, userAnswer, jobDescription, resumeText } =
      await request.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EVALUATE_ANSWER_SYSTEM_PROMPT },
        {
          role: 'user',
          content: EVALUATE_ANSWER_USER_PROMPT(
            question,
            questionCategory || 'general',
            userAnswer,
            jobDescription || '',
            resumeText || ''
          ),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const feedback = JSON.parse(responseText) as AnswerFeedback;

    // Ensure score is within bounds
    feedback.score = Math.max(0, Math.min(100, feedback.score));

    // Ensure arrays exist
    feedback.strengths = feedback.strengths || [];
    feedback.improvements = feedback.improvements || [];

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('Evaluate answer error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Failed to evaluate answer: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
