'use client'

import { Video } from '@/types/video'
import { useState } from 'react'

interface VideoQueueProps {
  videos: Video[]
  onUpdateVideo: (id: string, updates: Partial<Video>) => void
  onDeleteVideo: (id: string) => void
}

export default function VideoQueue({ videos, onUpdateVideo, onDeleteVideo }: VideoQueueProps) {
  const [postingId, setPostingId] = useState<string | null>(null)

  const handlePost = async (video: Video) => {
    if (!video.platforms.length) {
      alert('No platforms selected for this video')
      return
    }

    setPostingId(video.id)
    onUpdateVideo(video.id, { status: 'posting' })

    try {
      const response = await fetch('/api/post-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: video.id,
          platforms: video.platforms,
          caption: video.caption,
          hashtags: video.hashtags,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        onUpdateVideo(video.id, {
          status: 'posted',
          postedAt: new Date(),
        })
      } else {
        onUpdateVideo(video.id, {
          status: 'error',
          error: result.error || 'Failed to post video',
        })
      }
    } catch (error) {
      onUpdateVideo(video.id, {
        status: 'error',
        error: 'Network error while posting',
      })
    } finally {
      setPostingId(null)
    }
  }

  const getStatusColor = (status: Video['status']) => {
    switch (status) {
      case 'generating': return 'bg-blue-100 text-blue-700'
      case 'ready': return 'bg-green-100 text-green-700'
      case 'posting': return 'bg-yellow-100 text-yellow-700'
      case 'posted': return 'bg-purple-100 text-purple-700'
      case 'error': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12 text-center">
        <div className="text-6xl mb-4">📹</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No videos yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Generate your first video to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {video.topic}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(video.status)}`}>
                  {video.status}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {video.caption}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>🎬 Script: {video.script.length} chars</span>
                <span>
                  📱 {video.platforms.map(p => p === 'instagram' ? 'IG' : 'TT').join(' + ')}
                </span>
                <span>
                  📅 {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {video.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {video.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm mb-3">
                  Error: {video.error}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              {video.status === 'ready' && (
                <button
                  onClick={() => handlePost(video)}
                  disabled={postingId === video.id}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm whitespace-nowrap"
                >
                  {postingId === video.id ? 'Posting...' : 'Post Now'}
                </button>
              )}

              {video.status === 'error' && (
                <button
                  onClick={() => onUpdateVideo(video.id, { status: 'ready', error: undefined })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm whitespace-nowrap"
                >
                  Retry
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm('Delete this video?')) {
                    onDeleteVideo(video.id)
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              View Script
            </summary>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {video.script}
            </div>
          </details>
        </div>
      ))}
    </div>
  )
}
