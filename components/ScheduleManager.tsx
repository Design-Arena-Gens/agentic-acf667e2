'use client'

import { Video } from '@/types/video'
import { useState } from 'react'
import { format } from 'date-fns'

interface ScheduleManagerProps {
  videos: Video[]
  onUpdateVideo: (id: string, updates: Partial<Video>) => void
}

export default function ScheduleManager({ videos, onUpdateVideo }: ScheduleManagerProps) {
  const [autoPostEnabled, setAutoPostEnabled] = useState(false)
  const [postingFrequency, setPostingFrequency] = useState('daily')

  const readyVideos = videos.filter(v => v.status === 'ready' && !v.scheduledFor)
  const scheduledVideos = videos.filter(v => v.scheduledFor).sort((a, b) =>
    new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime()
  )

  const handleScheduleVideo = (video: Video) => {
    const dateInput = prompt('Enter date and time (YYYY-MM-DD HH:MM):')
    if (!dateInput) return

    try {
      const scheduledDate = new Date(dateInput)
      if (isNaN(scheduledDate.getTime())) {
        alert('Invalid date format')
        return
      }

      if (scheduledDate < new Date()) {
        alert('Cannot schedule in the past')
        return
      }

      onUpdateVideo(video.id, { scheduledFor: scheduledDate })
    } catch (error) {
      alert('Invalid date format')
    }
  }

  const handleUnschedule = (video: Video) => {
    onUpdateVideo(video.id, { scheduledFor: undefined })
  }

  const handleAutoSchedule = () => {
    const unscheduledReady = videos.filter(v => v.status === 'ready' && !v.scheduledFor)

    if (unscheduledReady.length === 0) {
      alert('No videos available to schedule')
      return
    }

    const now = new Date()
    const hoursPerPost = postingFrequency === 'daily' ? 24 : postingFrequency === 'twice-daily' ? 12 : 8

    unscheduledReady.forEach((video, index) => {
      const scheduledDate = new Date(now.getTime() + (index * hoursPerPost * 60 * 60 * 1000))
      scheduledDate.setHours(10, 0, 0, 0) // Default to 10 AM
      onUpdateVideo(video.id, { scheduledFor: scheduledDate })
    })

    alert(`Scheduled ${unscheduledReady.length} videos`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Posting Schedule
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Auto-Post Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically post videos at scheduled times
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPostEnabled}
                onChange={(e) => setAutoPostEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Posting Frequency
            </label>
            <select
              value={postingFrequency}
              onChange={(e) => setPostingFrequency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="daily">Once Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="thrice-daily">Three Times Daily</option>
            </select>
          </div>

          <button
            onClick={handleAutoSchedule}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold"
          >
            Auto-Schedule All Ready Videos
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Scheduled Posts ({scheduledVideos.length})
        </h3>

        {scheduledVideos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No scheduled posts yet
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {video.topic}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      📅 {format(new Date(video.scheduledFor!), 'MMM dd, yyyy')}
                    </span>
                    <span>
                      🕐 {format(new Date(video.scheduledFor!), 'hh:mm a')}
                    </span>
                    <span>
                      📱 {video.platforms.join(', ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleUnschedule(video)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                >
                  Unschedule
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Ready to Schedule ({readyVideos.length})
        </h3>

        {readyVideos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            All videos are scheduled or posted
          </div>
        ) : (
          <div className="space-y-3">
            {readyVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {video.topic}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {video.caption}
                  </p>
                </div>
                <button
                  onClick={() => handleScheduleVideo(video)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
                >
                  Schedule
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
