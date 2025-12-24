import { NextRequest, NextResponse } from 'next/server'
import { PostingResult } from '@/types/video'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId, platforms, caption, hashtags } = body

    const results: PostingResult[] = []

    // Post to Instagram
    if (platforms.includes('instagram')) {
      try {
        const instagramResult = await postToInstagram(videoId, caption, hashtags)
        results.push(instagramResult)
      } catch (error: any) {
        results.push({
          platform: 'instagram',
          success: false,
          error: error.message,
        })
      }
    }

    // Post to TikTok
    if (platforms.includes('tiktok')) {
      try {
        const tiktokResult = await postToTikTok(videoId, caption, hashtags)
        results.push(tiktokResult)
      } catch (error: any) {
        results.push({
          platform: 'tiktok',
          success: false,
          error: error.message,
        })
      }
    }

    const allSuccess = results.every(r => r.success)

    if (allSuccess) {
      return NextResponse.json({
        success: true,
        results,
        message: 'Posted successfully to all platforms',
      })
    } else {
      return NextResponse.json({
        success: false,
        results,
        message: 'Some posts failed',
      }, { status: 207 })
    }
  } catch (error: any) {
    console.error('Error posting video:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to post video' },
      { status: 500 }
    )
  }
}

async function postToInstagram(
  videoId: string,
  caption: string,
  hashtags: string[]
): Promise<PostingResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!accessToken || !userId) {
    return {
      platform: 'instagram',
      success: false,
      error: 'Instagram credentials not configured. Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in your environment variables.',
    }
  }

  // In production, this would use the Instagram Graph API
  // For demo purposes, we'll simulate success
  console.log(`Would post to Instagram: ${videoId}`)
  console.log(`Caption: ${caption}`)
  console.log(`Hashtags: ${hashtags.join(', ')}`)

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    platform: 'instagram',
    success: true,
    postId: `ig_${Date.now()}`,
  }

  // Real implementation would look like:
  /*
  try {
    // Step 1: Create media container
    const containerResponse = await fetch(
      `https://graph.instagram.com/v18.0/${userId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: videoUrl,
          caption: `${caption}\n\n${hashtags.map(h => `#${h}`).join(' ')}`,
          access_token: accessToken,
        }),
      }
    )

    const containerData = await containerResponse.json()

    // Step 2: Publish media
    const publishResponse = await fetch(
      `https://graph.instagram.com/v18.0/${userId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: accessToken,
        }),
      }
    )

    const publishData = await publishResponse.json()

    return {
      platform: 'instagram',
      success: true,
      postId: publishData.id,
    }
  } catch (error: any) {
    return {
      platform: 'instagram',
      success: false,
      error: error.message,
    }
  }
  */
}

async function postToTikTok(
  videoId: string,
  caption: string,
  hashtags: string[]
): Promise<PostingResult> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN

  if (!accessToken) {
    return {
      platform: 'tiktok',
      success: false,
      error: 'TikTok credentials not configured. Please set TIKTOK_ACCESS_TOKEN in your environment variables.',
    }
  }

  // In production, this would use the TikTok API
  // For demo purposes, we'll simulate success
  console.log(`Would post to TikTok: ${videoId}`)
  console.log(`Caption: ${caption}`)
  console.log(`Hashtags: ${hashtags.join(', ')}`)

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    platform: 'tiktok',
    success: true,
    postId: `tt_${Date.now()}`,
  }

  // Real implementation would look like:
  /*
  try {
    const response = await fetch(
      'https://open-api.tiktok.com/share/video/upload/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video: {
            video_url: videoUrl,
          },
          post_info: {
            title: caption,
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_comment: false,
            disable_duet: false,
            disable_stitch: false,
          },
        }),
      }
    )

    const data = await response.json()

    return {
      platform: 'tiktok',
      success: data.error?.code === 'ok',
      postId: data.data?.share_id,
      error: data.error?.message,
    }
  } catch (error: any) {
    return {
      platform: 'tiktok',
      success: false,
      error: error.message,
    }
  }
  */
}
