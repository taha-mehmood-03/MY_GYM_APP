# My Gym App

A comprehensive fitness application built with Next.js, featuring exercise tracking, calorie management, and workout scheduling.

## Project Structure

```
my-gym-app/
├── pages/                      # Next.js Pages Router
│   ├── api/                    # API routes
│   │   ├── auth/               
│   │   │   ├── login.js        # POST /api/auth/login
│   │   │   └── register.js     # POST /api/auth/register
│   │   ├── scheduling/         # Workout scheduling APIs
│   │   │   ├── create.js       # POST/GET /api/scheduling/create
│   │   │   ├── update.js       # PUT /api/scheduling/update
│   │   │   └── delete.js       # DELETE /api/scheduling/delete
│   │   ├── images/             # Image handling APIs
│   │   │   ├── get.js          # GET /api/images/get
│   │   │   └── store.js        # POST /api/images/store
│   │   ├── exercises/          # Exercise APIs
│   │   │   ├── index.js        # GET /api/exercises?url=...
│   │   │   ├── bodypart.js     # GET /api/exercises/bodypart?bodyPart=...
│   │   │   └── bodypartlist.js # GET /api/exercises/bodypartlist
│   │   └── calories/           # Calorie calculation API
│   │       └── index.js        # GET /api/calories?sex=...&age=...
│   │
│   ├── _app.js                 # Layout wrapper (Redux/NextUI providers)
│   ├── index.js                # Homepage/Login
│   ├── MainPage.js             # Dashboard
│   ├── Calendar.js             # Workout calendar
│   ├── Calories.js             # Calorie tracker
│   ├── SpecificPart.js         # Body part exercises
│   └── SpecificWorkout.js      # Exercise details
│
├── public/                     # Static assets
│   ├── images/                 # Exercise images
│   └── favicon.ico
│
├── src/                        # Source files
│   ├── components/             # Reusable components
│   │   ├── NAVBAR/             # Navigation components
│   │   ├── CALORIES/           # Calorie tracking UI
│   │   ├── BODYPARTLIST/       # Body part selection
│   │   ├── LOGIN/              # Login components
│   │   ├── SIGNUP/             # Registration components
│   │   ├── PLAN/               # Workout planning
│   │   ├── LOADER/             # Loading states
│   │   ├── SKELETON/           # Skeleton loaders
│   │   ├── SpecificBody/       # Body part specific
│   │   └── SpecificExercise/   # Exercise specific
│   │
│   ├── STORE/                  # Redux state management
│   │   ├── store.js            # Redux store configuration
│   │   ├── exerciseSlice.js    # Exercise data management
│   │   ├── caloriesSlice.js    # Calorie tracking
│   │   ├── imagesSlice.js      # Image management
│   │   ├── specificBodySlice.js # Body part data
│   │   ├── specificExerciseSlice.js # Exercise details
│   │   ├── mediaSlice.js       # Media handling
│   │   └── filteredImagesSlice.js # Image filtering
│   │
│   ├── db/                     # Database configuration
│   │   └── mongodb.js          # MongoDB connection
│   │
│   ├── utils/                  # Utility functions
│   │   ├── axios-config.js     # API client configuration
│   │   └── api-config.js       # Centralized API configuration
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useImageMap.js      # Image mapping hook
│   │   ├── useFormCal.js       # Calorie form hook
│   │   ├── useFetchImages.js   # Image fetching hook
│   │   └── useFetchExercises.js # Exercise fetching hook
│   │
│   └── app/                    # Legacy app router files
│       ├── globals.css         # Global styles
│       └── favicon.ico         # App icon
│
├── tailwind.config.js          # Tailwind CSS + NextUI configuration
├── next.config.js             # Next.js configuration
├── jsconfig.json              # JavaScript path aliases
└── package.json               # Dependencies and scripts
```

## Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, NextUI
- **State Management**: Redux Toolkit, Redux Persist, React Query
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT, bcryptjs
- **External APIs**: ExerciseDB API, Cloudinary, Nutrition Calculator API
- **Styling**: Tailwind CSS with custom theme

## Code Organization & Optimization

The project has been optimized for Next.js with no unnecessary dependencies:

### **✅ Next.js Optimizations:**
- **Removed Express.js** - Using Next.js built-in API routes
- **Removed CORS** - Next.js handles CORS automatically
- **Removed compression** - Next.js has built-in compression
- **Removed webpack plugins** - Next.js handles optimization
- **Removed image optimization packages** - Using Next.js Image component
- **Removed redundant packages** - Cleaned up duplicate functionality

### **✅ Centralized Configuration:**
- **API Configuration**: All API keys and endpoints in `src/utils/api-config.js`
- **Unified API Routes**: All external API calls through Next.js API routes
- **Clean Architecture**: Separated frontend and backend concerns

### **✅ Security:**
- **Updated dependencies** - All security vulnerabilities fixed
- **Minimal attack surface** - Removed unnecessary packages
- **Next.js best practices** - Following recommended patterns

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   MONGO_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_URL=your_api_url
   ```

3. Run the development server:
```bash
npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Scheduling
- `POST /api/scheduling/create` - Create workout appointment
- `GET /api/scheduling/create` - Get all appointments
- `PUT /api/scheduling/update` - Update appointment
- `DELETE /api/scheduling/delete?id=...` - Delete appointment

### Images
- `GET /api/images/get` - Get exercise images
- `POST /api/images/store` - Store exercise images

### Exercises
- `GET /api/exercises?url=...` - Generic exercise API call
- `GET /api/exercises/bodypartlist` - Get list of body parts
- `GET /api/exercises/bodypart?bodyPart=...` - Get exercises for specific body part

### Calories
- `GET /api/calories?sex=...&age=...&feet=...&inches=...&weight=...` - Calculate calorie needs

## Features

- Exercise database integration
- Body part categorization
- Workout planning and scheduling
- Calorie tracking
- User authentication
- Image management
- Responsive design
