# Interviewly

Interviewly is a role-based video interview platform featuring real-time collaboration, screen sharing, live captions, and an integrated code editor.

## Features

- **Role-Based Access:** Distinct interviewer and candidate experiences with secure authentication and role management.
- **Real-Time Video Interviews:** High-quality video calls with screen sharing and live closed captions.
- **Collaborative Code Editor:** Built-in code editor for technical interviews with language selection and real-time updates.
- **AI-Driven Automation:** Mock interviews powered by AI, automatic parsing and scoring of candidate responses, and instant feedback reports highlighting scores, strengths, and areas for improvement.
- **Interviewer Dashboard:** Schedule interviews, review past recordings, rate candidates, and manage team roles.
- **Instant Evaluation:** Automated scoring and feedback reduce manual evaluation time by up to 80%.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Authentication:** Clerk
- **Video & Collaboration:** Stream
- **Backend:** Convex, Firebase
- **AI & Automation:** Vapi AI, Gemini AI

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Install dependencies:
    ```bash
    npm install
    ```
2. Set up environment variables in `.env.local` for Firebase, Clerk, Stream, and AI providers.
3. Run the development server:
    ```bash
    npm run dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- [`src/app`](src/app) - Next.js app directory (routes, pages, layouts)
- [`src/components`](src/components) - UI and feature components
- [`src/hooks`](src/hooks) - Custom React hooks
- [`src/lib`](src/lib) - Utilities and server actions
- [`convex/`](convex) - Convex backend functions and schema
- [`firebase/`](firebase) - Firebase admin and client setup
- [`public/`](public) - Static assets

## License

MIT
