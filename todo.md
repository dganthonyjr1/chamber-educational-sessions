# SIA AI Academy - TODO

## Phase 1: Retell AI Voice Integration
- [ ] Integrate Retell AI for voice conversations
- [ ] Add voice call button to all pages
- [ ] Configure Retell AI agent for SIA AI Academy

## Phase 2: Course Progression System
- [x] Create database schema for courses, lessons, and progress
- [ ] Build 4-course structure (What Is AI → Business Tasks → Growth → Safety)
- [x] Add lesson thumbnail upload for each lesson
- [x] Add lesson description field for each lesson
- [ ] Build course navigation and progress tracking
- [ ] Add video upload interface for each lesson (60+ min support via S3)
- [ ] Implement video player with S3 streaming
- [ ] Create course-specific quiz sets
- [ ] Link quizzes to courses with completion tracking

## Phase 6: Pro-Tips & Business Solutions
- [x] Create pro-tips database table
- [x] Link pro-tips to specific lessons (not random)
- [x] Each lesson has relevant problem/solution tips
- [x] Pro-tips match lesson content for context
- [x] Showcase SIA expertise subtly without advertising

## Phase 5: Advanced Learning & Bonus Content
- [ ] Add 2 placeholder courses for advanced learning
- [ ] Create bonus PDF download system
- [ ] Download and host PDF from Google Drive
- [ ] Unlock bonus PDF after completing all 4 courses
- [ ] Add completion certificate/badge

## Phase 2: Social Sharing
- [x] Add social sharing for all platforms (LinkedIn, Facebook, Twitter, TikTok, Instagram)
- [x] Brand share messages for each platform
- [ ] Create achievement badges system

## Phase 7: Voice Agent & Multi-Language
- [ ] Integrate Gemini LLM for voice agent intelligence
- [ ] Connect Retell AI for voice interface
- [ ] Voice agent walks users through lessons
- [ ] Voice agent answers business questions
- [x] Add bilingual support (English & Spanish)
- [x] Language toggle in header
- [x] Translate all site content to Spanish
- [x] Voice agent speaks English and Spanish
- [x] Save user language preference

## Phase 3: Integrated Tools
- [x] Add ChatGPT button for AI assistance
- [x] Integrate Zoom meeting scheduler/launcher
- [x] Add Retell AI voice call button on all pages
- [x] Implement talking agent guide on home page (post-login)
- [x] Auto-trigger voice guide after magic link sign-in

## Phase 4: Authentication & Organizations
- [x] Implement magic link authentication system
- [x] Create magic link generation endpoint
- [x] Add organization affiliations display
- [x] Show partner organizations/Chamber members
- [x] Track user organization membership
- [x] Create custom signup pages for each organization
- [x] Add backlinks to organization signup/website
- [x] Implement organization-specific magic link generation
- [x] Add organization branding (logo, colors) to member experience

## Completed
- [x] Basic gamified quiz system with streaks
- [x] Score tracking and achievements
- [x] ScrapeX dark theme branding
- [x] Upgraded to web-db-user for S3 storage and database
- [x] Created database schema with thumbnails and descriptions
- [x] Built tRPC API routes for all features
- [x] Seeded 4 courses with quiz questions

## Urgent Fixes
- [x] Remove user name from header
- [x] Translate course titles and descriptions from database
- [x] Translate organization names and descriptions
- [x] Ensure ALL dynamic content translates properly

## Layout & Content Fixes
- [x] Make all pages symmetrical (balanced layouts)
- [x] Update course descriptions to match original user-provided content
- [ ] Ensure consistent spacing and alignment across all sections

## Footer Video
- [x] Add video link to footer section
- [x] Ensure video link works and is bilingual

## Button Improvements
- [x] Replace generic floating icons with clear labeled buttons
- [x] Add text labels so users know what each button does

## Follow-Up Implementation
- [x] Create admin interface for video uploads
- [x] Add video upload form for each lesson
- [x] Implement S3 video storage with 60+ minute support
- [x] Create video player for lessons
- [x] Generate lesson-specific pro-tips for Course 1
- [x] Generate lesson-specific pro-tips for Course 2
- [x] Generate lesson-specific pro-tips for Course 3
- [x] Generate lesson-specific pro-tips for Course 4
- [x] Display pro-tips on lesson pages (ready for when lessons exist)
- [x] Database schema updated with Spanish fields for lessons
- [x] API endpoints created for lesson upload with video/thumbnail

## Organization Card Layout Fix
- [x] Move organization name to top of card (centered)
- [x] Keep description in middle
- [x] Move "Visit Website" button to bottom (centered)
- [x] Apply to all organization cards

## Button Size & Mobile Optimization
- [x] Reduce size of AI Coach button
- [x] Reduce size of ChatGPT button
- [x] Reduce size of Meeting button
- [x] Optimize Home page for mobile devices (header responsive)
- [x] Optimize Home page hero and courses grid for mobile
- [ ] Optimize Course page for mobile devices
- [ ] Optimize Quiz page for mobile devices
- [ ] Optimize Admin page for mobile devices

## Retell AI Talking Agent
- [x] Install Retell AI Web SDK
- [x] Implement Retell AI client initialization
- [x] Create site concierge agent configuration
- [x] Add voice call button with status indicators
- [x] Implement voice guidance for courses
- [x] Add business AI assistance capability
- [ ] Test voice agent functionality (requires API keys)
- [ ] Test on phone screen sizes (320px-480px)
- [ ] Test on tablet screen sizes (768px-1024px)
- [ ] Ensure all text is readable on mobile
- [ ] Ensure all buttons are tappable on mobile
- [ ] Fix any layout overflow issues on small screens

## Organization Clarity Fix
- [x] Update "Local Chamber of Commerce" to "Wildwood Chamber of Commerce" (or specific Chamber name)
- [x] Add location context to all organization names
- [x] Change "Join" buttons to link to actual organization signup URLs
- [x] Update database with specific organization names and real signup links
- [x] Ensure users know which Chamber/organization they're joining

## Chamber Location Detection
- [x] Add IP geolocation API integration to detect user's city and state
- [ ] Create database table for US Chambers with city, state, and signup URLs
- [x] Seed database with sample Chambers across different US locations
- [x] Seed all 21 NJ county Chambers with locations
- [x] Implement proximity-based Chamber matching (closest Chamber to user)
- [x] Implement Chamber matching logic based on user location
- [x] Show user's local Chamber instead of Wildwood Chamber
- [ ] Add fallback to default Chamber if location can't be detected
- [ ] Test location detection with different IP addresses

## Retell AI Agent Enhancement (Tomorrow)
- [ ] Configure Retell AI agent with Chamber database knowledge
- [ ] Add all 21 NJ Chambers info to agent knowledge base
- [ ] Train agent on Sudden Impact Agency services and AI training courses
- [ ] Enable agent to answer Chamber location questions
- [ ] Test agent with Chamber-related queries
- [ ] Document agent configuration for future updates

## Faceless AI Educational Videos (Tomorrow)
- [ ] Research faceless video creation tools/services
- [ ] Define video content structure for each course
- [ ] Create video scripts for Course 1 lessons
- [ ] Generate or source faceless video content
- [ ] Upload videos to S3 storage
- [ ] Link videos to lessons in database
- [ ] Test video playback on all devices

## Chamber Database Updates
- [x] Add SHCCNJ (Statewide Hispanic Chamber) to database as 22nd organization
- [x] Research and add SHCCNJ social media links (LinkedIn, Twitter)
- [x] Verify all 21 county Chambers are the major/primary ones for each county
- [x] Update any county Chambers that aren't the largest/most influential

## Design Updates
- [x] Redesign theme from dark to light beachy Wildwood NJ aesthetic
- [x] Update color palette: sandy beige backgrounds, ocean blues, sunset accents
- [x] Ensure readability and accessibility with new light theme
- [x] Test across all pages and components

## Bug Fixes
- [ ] Fix tRPC API error: "Unexpected token '<', "<!doctype "... is not valid JSON"
- [ ] Investigate why API endpoint is returning HTML instead of JSON

## Video Upload & Playback System
- [x] Update database schema to add videoUrl field to lessons table
- [x] Create tRPC procedure for generating presigned S3 upload URLs
- [x] Create tRPC procedure for updating lesson with video URL
- [x] Build admin video upload interface with file picker
- [x] Add video player component to lesson pages
- [x] Implement video progress tracking for completion
- [ ] Test video upload with sample MP4 file
- [ ] Test video playback on desktop and mobile
- [x] Add video duration display and controls

## Large Video File Support (Up to 1 Hour)
- [x] Replace base64 upload with presigned S3 URLs for direct uploads
- [x] Add progress bar for large file uploads
- [x] Handle videos up to 2GB in size
- [ ] Test with actual 30-60 minute MP4 files

## FirstMovers.ai-Inspired Redesign
- [x] Update color scheme to use teal/turquoise green from SIA logo (#14b8a6)
- [x] Redesign hero section with bolder, more impactful typography
- [x] Add prominent teal green CTA buttons throughout site
- [x] Improve course cards with modern layout and shadows
- [x] Add difficulty level badges to courses (Beginner, Intermediate, Advanced)
- [x] Increase whitespace and breathing room between sections
- [x] Make typography hierarchy more pronounced (larger headings)
- [x] Update button styles with teal green background and rounded corners
- [x] Test redesign on all pages for consistency

## Background Color Update
- [x] Change background from beige to pure white
- [x] Add light teal accents throughout the design
- [x] Ensure text remains readable with new color scheme

## Revenue Share Section
- [x] Create dedicated Partnership/Revenue Share page
- [x] Add 15% community revenue share details
- [x] Add 50% Chamber discount information
- [x] Include payment terms and conditions
- [x] Add revenue share section to homepage
- [ ] Link to Partnership page from footer and navigation

## SIA Branding Colors Update
- [x] Analyze suddenimpactagency.io to extract brand color palette
- [x] Update CSS theme with SIA brand colors (primary, secondary, accent)
- [x] Maintain white background as requested
- [x] Test color scheme across all pages for consistency

## SIA Button and Course Block Colors
- [x] Update all buttons to use SIA brand colors (magenta primary, cyan accent)
- [x] Update course blocks with SIA color scheme
- [x] Ensure consistent color usage across all pages
