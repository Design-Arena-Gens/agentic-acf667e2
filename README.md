# Social Video AI Agent

An AI-powered platform for automatically creating and posting engaging videos to Instagram Reels and TikTok.

## Features

- 🎬 **AI Video Generation**: Create engaging video scripts using GPT-4
- 📱 **Multi-Platform Support**: Post to Instagram Reels and TikTok
- 📅 **Smart Scheduling**: Auto-schedule posts at optimal times
- 🎯 **Content Optimization**: AI-generated captions and trending hashtags
- 📊 **Video Queue Management**: Track and manage your video content pipeline

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- Instagram Graph API credentials (optional, for actual posting)
- TikTok API credentials (optional, for actual posting)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_USER_ID=your_instagram_user_id_here
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Generate Videos

1. Go to the "Generate Video" tab
2. Enter your video topic (e.g., "5 productivity tips for entrepreneurs")
3. Select video style (Educational, Entertainment, Motivational, or Trending)
4. Choose duration (15-60 seconds)
5. Select target platforms (Instagram, TikTok, or both)
6. Click "Generate Video"

### Manage Queue

View all generated videos in the queue, post them immediately, or delete them.

### Schedule Posts

- Enable auto-post mode for automatic posting
- Set posting frequency (daily, twice daily, or three times daily)
- Auto-schedule all ready videos
- Manually schedule individual videos

## API Configuration

### Instagram API

To enable Instagram posting:

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Set up Instagram Basic Display API
3. Get your access token and user ID
4. Add them to your `.env` file

### TikTok API

To enable TikTok posting:

1. Apply for TikTok Developer access at [developers.tiktok.com](https://developers.tiktok.com)
2. Create an app and get your API credentials
3. Add your access token to your `.env` file

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 for content generation
- **Date Handling**: date-fns
- **Deployment**: Vercel

## Deployment

Deploy to Vercel:

```bash
vercel deploy --prod
```

## Features Roadmap

- [ ] Video generation with AI (text-to-video)
- [ ] Voice-over generation
- [ ] Advanced video editing
- [ ] Analytics dashboard
- [ ] A/B testing for captions
- [ ] Trend detection and recommendations
- [ ] Team collaboration features

## Demo Mode

The application runs in demo mode by default. Actual posting requires valid API credentials for Instagram and TikTok.

## License

MIT
