# Nganiriza - Sexual and Reproductive Health Platform

## Description

Nganiriza is a comprehensive mobile-first web application designed to provide teenagers and young adults in Rwanda with accessible, confidential information and support regarding sexual and reproductive health (SRH). The platform aims to bridge the gap in SRH education and services by offering a safe, private space where users can seek information, connect with healthcare professionals, and access resources.

### Key Features

- **AI Chat Assistant**: Get instant, confidential answers to SRH questions through an intelligent chatbot
- **Specialist Consultation**: Connect with verified healthcare professionals via text or video chat
- **Interactive Map**: Locate nearby youth-friendly health centers and reproductive health services
- **Educational Resources**: Access age-appropriate content on puberty, relationships, contraception, and STI prevention
- **Multi-language Support**: Available in English, French, and Kinyarwanda to serve Rwanda's diverse population
- **Privacy-First Design**: All interactions are confidential with no data sharing

## GitHub Repository

**Repository Link**: [https://github.com/Eliane-M/nganiriza_capstone](https://github.com/Eliane-M/nganiriza_capstone)

## Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 6.26.2
- **Icons**: Lucide React 0.522.0
- **Maps**: React Leaflet 4.2.1 + Leaflet 1.9.4
- **Development**: Node.js, npm

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## Environment Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Eliane-M/nganiriza_capstone.git
cd nganiriza_capstone
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Vite
- Tailwind CSS
- TypeScript
- React Router
- Lucide Icons
- React Leaflet
- All development dependencies

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173/`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```


## Design & Mockups

### Application Screenshots

#### 1. Home Page
Home Page
*Main landing page with feature navigation and language switcher*
<img width="329" height="706" alt="image" src="https://github.com/user-attachments/assets/f2e7bf35-a347-4be1-bae9-6e5a2ced80ec" />

<img width="366" height="765" alt="image" src="https://github.com/user-attachments/assets/c54a2a89-43b2-427f-bfc8-7ce70d994f4b" />

<img width="370" height="770" alt="image" src="https://github.com/user-attachments/assets/639e0237-0e0a-4166-99ed-9586767d8282" />



#### 2. AI Chat Interface
Chat Page
*Real-time chat with AI assistant for SRH questions*
<img width="370" height="767" alt="image" src="https://github.com/user-attachments/assets/e6fc6b58-ac8c-4fb0-a1b8-358e46d7b377" />


#### 3. Specialist Consultation
Specialists Page
*Connect with healthcare professionals via text or video*
<img width="364" height="775" alt="image" src="https://github.com/user-attachments/assets/46f3f78f-c249-498a-95d5-96226605852b" />


#### 4. Interactive Map
Map View
*Locate nearby health services with filtering options*
<img width="367" height="764" alt="image" src="https://github.com/user-attachments/assets/d08d2167-62e7-47b8-9d79-27fff53d3114" />


#### 5. Educational Resources
Education Page
*Age-appropriate learning materials on SRH topics*
<img width="372" height="769" alt="image" src="https://github.com/user-attachments/assets/2c9813b8-812c-467f-93b2-941c855cf95a" />


#### 6. Authentication
Login/Signup
*Secure user authentication system*
<img width="368" height="768" alt="image" src="https://github.com/user-attachments/assets/58d2bcb1-d0a4-4440-b5af-2bb84e8aab91" />


### Design Files

- **Color Palette**: 
  - Primary: Purple (#7C3AED)
  - Secondary: Purple variants (#A78BFA, #DDD6FE)
  - Accent: Teal, Pink, Orange for categorization
  - Backgrounds: White, Purple-50
- **Typography**: System font stack with clear hierarchy

### Design Principles

1. **Accessibility**: High contrast ratios, clear typography, touch-friendly targets
2. **Mobile-First**: Optimized for smartphone usage
3. **Culturally Sensitive**: Respectful imagery and language
4. **Privacy-Focused**: Minimal data collection, secure interactions
5. **Youth-Friendly**: Approachable, non-judgmental interface

## Features Overview

### 1. AI Chatbot
- Instant responses to SRH questions
- Natural language processing
- Context-aware conversations
- Privacy-preserved interactions

### 2. Specialist Consultation
- Browse verified healthcare professionals
- Filter by specialty and availability
- Text and video chat options
- Secure, encrypted communications

### 3. Interactive Map
- Geolocation-based service discovery
- Filter by service type
- Detailed facility information
- Directions and contact details

### 4. Educational Content
- Categorized learning modules
- Topics: Puberty, Relationships, Contraception, STI Prevention
- Age-appropriate content
- Regular updates with latest information

### 5. Resource Directory
- Comprehensive list of support services
- Emergency contacts
- Helplines and support groups
- Educational materials and downloads

### 6. Multi-language Support
- English
- French
- Kinyarwanda
- Seamless language switching

## Deployment Plan

### Phase 1: Development Environment (Current)
- Local development and testing
- Feature completion and bug fixes
- User acceptance testing

### Phase 2: Staging Environment
**Platform**: Vercel/Netlify (Free Tier)

1. **Setup Steps**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to staging
   vercel --prod
   ```

2. **Configuration**:
   - Environment variables setup
   - Custom domain configuration
   - SSL certificate (automatic)

3. **Testing**:
   - Functionality testing
   - Cross-browser compatibility
   - Mobile responsiveness
   - Performance optimization

### Phase 3: Production Deployment
**Recommended Platform**: Vercel or Netlify

#### Option A: Vercel Deployment

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Configure custom domain
vercel domains add nganiriza.app
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Option B: Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Phase 4: Backend Integration (Future)

1. **API Development**:
   - Node.js/Express or Python/FastAPI backend
   - PostgreSQL or MongoDB database
   - JWT authentication
   - RESTful API endpoints

2. **AI Integration**:
   - OpenAI GPT API for chatbot
   - Natural language processing
   - Response filtering and moderation

3. **Real-time Features**:
   - WebSocket for chat
   - Video calling (WebRTC or Twilio)
   - Push notifications

4. **Cloud Services**:
   - **Hosting**: AWS, Google Cloud, or Azure
   - **Database**: Amazon RDS or MongoDB Atlas
   - **Storage**: AWS S3 for media files
   - **CDN**: CloudFront or Cloudflare

### Phase 5: Monitoring & Maintenance

1. **Analytics**:
   - Google Analytics for usage tracking
   - Error monitoring (Sentry)
   - Performance monitoring (Lighthouse CI)

2. **Security**:
   - Regular security audits
   - HTTPS enforcement
   - Data encryption
   - GDPR compliance

3. **Updates**:
   - Regular content updates
   - Feature enhancements based on user feedback
   - Bug fixes and performance improvements


## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

![Video Demo](https://drive.google.com/drive/folders/16UHIOxy-6FDUir9eZjVTyS97p1s5a79T?usp=drive_link)

[Elaine Munezero_Final Capstone Version.pdf](https://github.com/user-attachments/files/23637811/Elaine.Munezero_Final.Capstone.Version.pdf)

