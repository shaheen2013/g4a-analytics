# Google Analytics Dashboard

A Next.js application that displays Google Analytics data after OAuth2 authentication.

## Features

- 🔐 Google OAuth2 Authentication
- 📊 Analytics Dashboard with Charts
- 📈 Real-time metrics (Users, Sessions, Page Views)
- 🌍 Geographic data
- 📄 Top pages statistics
- 🎨 Beautiful UI with Tailwind CSS
- 🌙 Dark mode support

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Analytics Data API
   - Google Analytics API

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-domain.vercel.app/api/auth/callback/google`
5. Save your **Client ID** and **Client Secret**

### 4. Get Your Google Analytics Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Admin** > **Property Settings**
4. Copy your **Property ID** (format: `properties/123456789`)

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google Analytics Property ID
GA_PROPERTY_ID=properties/123456789
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Update `NEXTAUTH_URL` to your Vercel domain
5. Add your Vercel domain to Google OAuth authorized redirect URIs
6. Deploy!

## Usage

1. Click "Sign in with Google"
2. Authorize the application to access your Analytics data
3. View your analytics dashboard with charts and metrics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **API**: Google Analytics Data API
- **Language**: TypeScript

## Troubleshooting

### "Failed to fetch analytics data"
- Verify your Google Analytics Property ID is correct
- Ensure you have access to the Analytics property
- Check that Google Analytics Data API is enabled

### OAuth errors
- Verify redirect URIs match exactly
- Check that credentials are correct in `.env.local`
- Ensure OAuth consent screen is configured

### No data showing
- Verify your Analytics property has data
- Check the date range (default is last 7 days)
- Ensure you granted Analytics permissions during OAuth

## License

MIT

