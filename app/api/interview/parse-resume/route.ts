import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(
    `parse-resume:${clientIp}`,
    RATE_LIMITS.parseResume
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';

    if (fileName.endsWith('.pdf')) {
      const uint8Array = new Uint8Array(arrayBuffer);
      const { text: pdfText } = await extractText(uint8Array);
      text = Array.isArray(pdfText) ? pdfText.join('\n') : pdfText;
    } else if (fileName.endsWith('.docx')) {
      text = await parseDocx(buffer);
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Please upload PDF or DOCX.' },
        { status: 400 }
      );
    }

    // Clean up the text
    text = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Could not extract text from the file' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
