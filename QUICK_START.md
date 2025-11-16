# Quick Start Guide

## What's Been Built

A complete university management web application with the following features:

### 1. **Derslerim (My Courses)** 📚
- Lists all current semester courses
- Shows course code, name, credits, semester
- Displays teacher information, schedule, and classroom
- Click any course to view detailed information

### 2. **Course Detail Page** 📖
Three main tabs:
- **Genel Bilgiler (Info)**: Course details, department, enrollment count
- **Dökümanlar (Documents)**: Upload and download course materials (PDF, DOC, TXT)
- **Sohbet (Chat)**: AI assistant that can answer questions about uploaded course documents

### 3. **AI Asistan (School Assistant)** 🤖
- General school chatbot for announcements and questions
- Real-time streaming responses using Server-Sent Events
- Suggested questions for quick access
- Answers questions about exams, schedules, and school information

### 4. **Document Knowledge Base** 📄
- Students can upload documents to each course
- Documents become part of the course knowledge base
- AI assistant uses these documents to answer course-specific questions

## How to Run

### Prerequisites
1. **Backend server** must be running on `http://localhost:3000`
   ```bash
   cd /Users/halil/Documents/repos/note.verse.backend
   npm run dev
   ```

2. **Chat service** must be running on `http://127.0.0.1:8000`

### Start the Frontend

```bash
# From the project directory
cd /Users/halil/Documents/repos/note.verse.ui

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
note.verse.ui/
├── src/
│   ├── api/                    # API integration
│   │   ├── axios.ts           # HTTP client setup
│   │   ├── chat.ts            # Chat API with SSE
│   │   ├── courses.ts         # Course endpoints
│   │   └── documents.ts       # Document upload/download
│   ├── components/            # Reusable components
│   │   ├── Layout.tsx        # App layout with sidebar
│   │   └── CourseChat.tsx    # Course chat component
│   ├── pages/                # Main pages
│   │   ├── Derslerim.tsx    # Courses list
│   │   ├── CourseDetail.tsx # Course details
│   │   └── Assistant.tsx    # AI assistant
│   ├── types/               # TypeScript types
│   │   └── index.ts        # All interfaces
│   ├── App.tsx             # Main app component
│   ├── main.tsx           # Entry point
│   └── theme.ts           # MUI theme
├── package.json
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript config
```

## Key Features

### Real-time Chat
- Uses Server-Sent Events (SSE) for streaming responses
- Maintains conversation thread history
- Context-aware responses based on uploaded documents

### Document Management
- Upload files (PDF, DOC, DOCX, TXT) to courses
- Store in backend database
- Download when needed
- Use as context for AI chat

### Responsive Design
- Mobile-friendly sidebar navigation
- Material-UI components
- Clean, modern interface
- Turkish language support

## API Integration

The app connects to these backend endpoints:

- `GET /api/course-offerings` - List all courses
- `GET /api/course-offerings/:id` - Get course details
- `GET /api/students/:id/enrollments` - Student enrollments
- `GET /api/departments/:id/documents` - Department documents
- `POST /api/documents` - Upload document
- `POST /api/chat` - Chat with AI assistant (SSE stream)

## Next Steps

### Recommended Enhancements:

1. **Authentication**
   - Add login/logout functionality
   - Store JWT tokens
   - Protect routes

2. **User Context**
   - Get actual logged-in student information
   - Filter courses by student enrollments
   - Personalize dashboard

3. **Backend Extensions**
   - Implement document upload endpoint in backend
   - Add `courseOfferingId` field to Document model
   - Create announcements system

4. **Additional Features**
   - Grade viewing
   - Assignment submission
   - Attendance tracking
   - Calendar view
   - Push notifications

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure the backend has CORS enabled for `http://localhost:5173`

### Chat Not Working
1. Verify chat service is running on `http://127.0.0.1:8000`
2. Check backend proxy configuration in `vite.config.ts`
3. Ensure backend forwards requests to chat service

### Documents Not Loading
1. Verify backend endpoint `/api/departments/:id/documents` exists
2. Check console for API errors
3. Ensure department has documents in database

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Lint code
npm run lint
```

## Tech Stack Summary

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Material-UI v5** - Component library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Server-Sent Events** - Real-time chat

---

Enjoy your new university management system! 🎓
