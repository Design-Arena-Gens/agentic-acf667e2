'use client'

import { useState } from 'react'
import { Video, VideoGenerationRequest } from '@/types/video'

interface VideoGeneratorProps {
  onVideoGenerated: (video: Video) => void
}

export default function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState<'educational' | 'entertainment' | 'motivational' | 'trending'>('educational')
  const [duration, setDuration] = useState(30)
  const [platforms, setPlatforms] = useState<('instagram' | 'tiktok')[]>(['instagram', 'tiktok'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')

  const handlePlatformToggle = (platform: 'instagram' | 'tiktok') => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic')
      return
    }

    if (platforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setIsGenerating(true)
    setProgress('Generating video script...')

    try {
      const request: VideoGenerationRequest = {
        topic,
        style,
        duration,
        platforms,
      }

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to generate video')
      }

      const video: Video = await response.json()
      onVideoGenerated(video)

      setTopic('')
      setProgress('Video generated successfully!')

      setTimeout(() => setProgress(''), 3000)
    } catch (error) {
      console.error('Error generating video:', error)
      setProgress('Error generating video. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Generate New Video
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 5 productivity tips for entrepreneurs"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isGenerating}
          >
            <option value="educational">Educational</option>
            <option value="entertainment">Entertainment</option>
            <option value="motivational">Motivational</option>
            <option value="trending">Trending/Viral</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration: {duration} seconds
          </label>
          <input
            type="range"
            min="15"
            max="60"
            step="5"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full"
            disabled={isGenerating}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>15s</span>
            <span>30s</span>
            <span>45s</span>
            <span>60s</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Platforms
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={platforms.includes('instagram')}
                onChange={() => handlePlatformToggle('instagram')}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                disabled={isGenerating}
              />
              <span className="text-gray-700 dark:text-gray-300">Instagram Reels</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={platforms.includes('tiktok')}
                onChange={() => handlePlatformToggle('tiktok')}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                disabled={isGenerating}
              />
              <span className="text-gray-700 dark:text-gray-300">TikTok</span>
            </label>
          </div>
        </div>

        {progress && (
          <div className={`p-4 rounded-lg ${
            progress.includes('Error')
              ? 'bg-red-100 text-red-700'
              : progress.includes('success')
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {progress}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? 'Generating Video...' : 'Generate Video'}
        </button>
      </div>
    </div>
  )
}
