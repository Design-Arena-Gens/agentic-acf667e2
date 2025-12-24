export interface Video {
  id: string
  topic: string
  script: string
  voiceover?: string
  videoUrl?: string
  thumbnail?: string
  caption: string
  hashtags: string[]
  status: 'generating' | 'ready' | 'posting' | 'posted' | 'error'
  platforms: ('instagram' | 'tiktok')[]
  scheduledFor?: Date
  createdAt: Date
  postedAt?: Date
  error?: string
}

export interface VideoGenerationRequest {
  topic: string
  style: 'educational' | 'entertainment' | 'motivational' | 'trending'
  duration: number
  platforms: ('instagram' | 'tiktok')[]
}

export interface PostingResult {
  platform: 'instagram' | 'tiktok'
  success: boolean
  postId?: string
  error?: string
}
