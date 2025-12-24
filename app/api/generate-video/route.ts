import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Video, VideoGenerationRequest } from '@/types/video'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json()
    const { topic, style, duration, platforms } = body

    // Generate video script using AI
    const scriptPrompt = `Create a ${duration}-second ${style} video script about: ${topic}

The script should be:
- Engaging and hook-driven (grab attention in first 3 seconds)
- Suitable for ${platforms.join(' and ')}
- Optimized for vertical video format (9:16)
- Include clear call-to-action at the end
- Written in a conversational, energetic tone

Format: Provide ONLY the script text that will be spoken/shown in the video. Keep it concise and impactful.`

    const scriptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media content creator specializing in viral short-form videos.',
        },
        {
          role: 'user',
          content: scriptPrompt,
        },
      ],
      temperature: 0.8,
    })

    const script = scriptResponse.choices[0]?.message?.content || ''

    // Generate caption and hashtags
    const captionPrompt = `Based on this video script, create:
1. An engaging caption (max 150 characters)
2. 8-12 relevant trending hashtags

Script: ${script}

Format your response as:
CAPTION: [your caption]
HASHTAGS: [hashtag1, hashtag2, hashtag3, ...]`

    const captionResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a social media expert who creates viral captions and hashtags.',
        },
        {
          role: 'user',
          content: captionPrompt,
        },
      ],
      temperature: 0.7,
    })

    const captionText = captionResponse.choices[0]?.message?.content || ''
    const captionMatch = captionText.match(/CAPTION:\s*(.+?)(?=\nHASHTAGS:|$)/s)
    const hashtagsMatch = captionText.match(/HASHTAGS:\s*(.+?)$/s)

    const caption = captionMatch?.[1]?.trim() || topic
    const hashtags = hashtagsMatch?.[1]
      ?.split(',')
      .map(tag => tag.trim().replace('#', ''))
      .filter(Boolean) || []

    // Create video object
    const video: Video = {
      id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topic,
      script,
      caption,
      hashtags,
      status: 'ready',
      platforms,
      createdAt: new Date(),
    }

    return NextResponse.json(video)
  } catch (error: any) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    )
  }
}
