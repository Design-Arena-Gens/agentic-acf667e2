'use client'

import { useState, useEffect } from 'react'
import VideoGenerator from '@/components/VideoGenerator'
import VideoQueue from '@/components/VideoQueue'
import ScheduleManager from '@/components/ScheduleManager'
import { Video } from '@/types/video'

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'queue' | 'schedule'>('generate')

  useEffect(() => {
    const savedVideos = localStorage.getItem('videos')
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos))
  }, [videos])

  const addVideo = (video: Video) => {
    setVideos(prev => [video, ...prev])
  }

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Social Video AI Agent
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Automatically create and post engaging videos to Instagram & TikTok
          </p>
        </header>

        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Generate Video
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'queue'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Video Queue ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Schedule Posts
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'generate' && (
            <VideoGenerator onVideoGenerated={addVideo} />
          )}
          {activeTab === 'queue' && (
            <VideoQueue
              videos={videos}
              onUpdateVideo={updateVideo}
              onDeleteVideo={deleteVideo}
            />
          )}
          {activeTab === 'schedule' && (
            <ScheduleManager videos={videos} onUpdateVideo={updateVideo} />
          )}
        </div>
      </div>
    </main>
  )
}
