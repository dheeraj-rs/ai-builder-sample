# WebBuilder AI - No-Code Website Builder Platform

A powerful no-code website builder platform featuring AI-powered chat interface and live preview capabilities, similar to bolt.new.

## Features

### Core Functionality
- **AI-Powered Chat Interface**: Build websites through natural conversation with GEMINI AI
- **Live Preview**: Real-time preview of your website with responsive design testing
- **Multi-Mode Editing**:
  - **Default Mode**: Direct preview of your website
  - **Click-to-Edit Mode**: Click elements to get AI assistance for editing
  - **Editor Mode**: Code editor for direct file editing
- **Project Management**: Create, save, load, and manage multiple projects
- **Multi-Page Support**: Add and manage multiple pages in your website
- **Export Functionality**: Download your project as a ZIP file for deployment

### Supported Project Types
1. **HTML/CSS/JS**: Static websites with plain HTML, CSS, and JavaScript
2. **Next.js**: React-based framework with TypeScript
3. **Astro**: Modern static site builder

### Technology Stack
- **Frontend**: React + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **AI**: Google GEMINI 2.0 Flash API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Supabase account
- GEMINI API key (provided in the code)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=AIzaSyAhJB5h3btdONhVYXcjvalk5ePTBm9JBgsM
```

Get your Supabase credentials from:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

3. **Database Setup**

The database schema has been automatically created with the following tables:
- `projects`: Store project metadata
- `project_files`: Store individual files for each project
- `chat_messages`: Store chat conversation history
- `project_pages`: Store multiple pages within a project

4. **Run Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

## Usage Guide

### Creating a New Project

1. Click "New Project" button in the header
2. Enter a project name
3. Select project type (HTML, Next.js, or Astro)
4. Click "Create Project"

### Building Your Website

1. **Using Chat Interface**:
   - Type your request in the chat input
   - Examples:
     - "Create a landing page for a coffee shop"
     - "Add a contact form to the page"
     - "Change the background color to blue"
     - "Create an about page"

2. **AI Response**:
   - The AI will generate code files automatically
   - Files are saved to the database
   - Preview updates in real-time

3. **Preview Modes**:
   - **Preview**: View your website as users would see it
   - **Click to Edit**: Click any element to ask AI for edits
   - **Editor**: Access code editor to manually edit files

### Managing Pages

1. Click "Add Page" button
2. Enter page name and route
3. AI can help create page content through chat
4. Pages are automatically added to your project structure

### Exporting Your Project

1. Click "Export" button in the header
2. Project downloads as a ZIP file
3. Extract and deploy to any hosting service

### Saving and Loading Projects

- **Auto-save**: Changes are automatically saved to database
- **Manual Save**: Click "Save" to ensure all changes are persisted
- **Load**: Click "Load" to view and open existing projects
- **Delete**: Remove projects from the load modal

## File Structure

```
src/
├── components/
│   ├── ChatInterface.tsx       # Chat UI component
│   ├── PreviewFrame.tsx        # Live preview with device modes
│   ├── CodeEditor.tsx          # File editor modal
│   ├── ProjectHeader.tsx       # Top navigation bar
│   ├── NewProjectModal.tsx     # Create project modal
│   ├── LoadProjectModal.tsx    # Load project modal
│   └── AddPageModal.tsx        # Add page modal
├── lib/
│   ├── supabase.ts            # Supabase client and types
│   ├── database.ts            # Database operations
│   ├── gemini.ts              # GEMINI AI integration
│   └── export.ts              # ZIP export functionality
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

## Database Schema

### projects
- `id`: Unique project identifier
- `name`: Project name
- `description`: Project description
- `project_type`: 'html', 'nextjs', or 'astro'
- `settings`: JSON configuration
- `created_at`, `updated_at`: Timestamps

### project_files
- `id`: Unique file identifier
- `project_id`: Reference to project
- `file_path`: Relative file path
- `content`: File content
- `file_type`: File extension
- `created_at`, `updated_at`: Timestamps

### chat_messages
- `id`: Unique message identifier
- `project_id`: Reference to project
- `role`: 'user', 'assistant', or 'system'
- `content`: Message text
- `metadata`: Additional data
- `created_at`: Timestamp

### project_pages
- `id`: Unique page identifier
- `project_id`: Reference to project
- `page_name`: Display name
- `route`: URL path
- `is_home`: Home page flag
- `order_index`: Display order
- `created_at`, `updated_at`: Timestamps

## API Integration

### GEMINI AI

The platform uses Google's GEMINI 2.0 Flash model for natural language processing:

```javascript
const API_KEY = 'AIzaSyAhJB5h3btdONhVYXcjvalk5ePTBm9JBgsM';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
```

The AI is instructed to:
- Generate production-ready code
- Follow modern web development best practices
- Create responsive, accessible designs
- Return files in a specific format for parsing

## Tips and Best Practices

1. **Be Specific**: The more detailed your requests, the better the results
2. **Iterate**: Start simple and add features incrementally
3. **Review Code**: Use Editor mode to review and refine generated code
4. **Save Often**: Click save after major changes
5. **Test Responsiveness**: Use device toggles to test mobile/tablet views
6. **Export Early**: Export your project to test locally before major changes

## Troubleshooting

### Preview Not Updating
- Click the refresh button in the preview toolbar
- Check browser console for errors
- Verify files are being saved (check Editor mode)

### AI Not Responding
- Verify GEMINI API key is correct
- Check internet connection
- Review browser console for API errors

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check Supabase project is active
- Ensure RLS policies are enabled

## Future Enhancements

Potential features for future development:
- Authentication and user accounts
- Collaboration features
- Version control and history
- Template library
- Component marketplace
- Direct deployment integration
- Custom AI model training
- Advanced code completion

## License

MIT License - Free to use and modify

## Support

For issues and questions:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure database migrations are applied
4. Test with a simple project first

---

Built with React, TypeScript, Supabase, and GEMINI AI
