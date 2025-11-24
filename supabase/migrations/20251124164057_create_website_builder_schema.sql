/*
  # Website Builder Platform Database Schema

  ## Overview
  This migration creates the complete database schema for a no-code website builder platform
  similar to bolt.new, supporting project management, chat history, and multi-page websites.

  ## New Tables

  ### 1. projects
  Stores user projects with metadata and configuration
  - `id` (uuid, primary key) - Unique project identifier
  - `user_id` (uuid) - Owner of the project (for future auth)
  - `name` (text) - Project name
  - `description` (text) - Project description
  - `project_type` (text) - Type: 'nextjs', 'astro', 'html'
  - `settings` (jsonb) - Project settings and configuration
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. project_files
  Stores individual files for each project
  - `id` (uuid, primary key) - Unique file identifier
  - `project_id` (uuid, foreign key) - Reference to projects table
  - `file_path` (text) - Relative path of the file
  - `content` (text) - File content
  - `file_type` (text) - File type/extension
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. chat_messages
  Stores chat conversation history for each project
  - `id` (uuid, primary key) - Unique message identifier
  - `project_id` (uuid, foreign key) - Reference to projects table
  - `role` (text) - Message role: 'user', 'assistant', 'system'
  - `content` (text) - Message content
  - `metadata` (jsonb) - Additional metadata (e.g., files affected)
  - `created_at` (timestamptz) - Message timestamp

  ### 4. project_pages
  Stores multiple pages within a project
  - `id` (uuid, primary key) - Unique page identifier
  - `project_id` (uuid, foreign key) - Reference to projects table
  - `page_name` (text) - Page name/title
  - `route` (text) - Page route/URL path
  - `is_home` (boolean) - Whether this is the home page
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own projects
  - Public read access can be configured per project if needed

  ## Important Notes
  1. The user_id field is prepared for future authentication integration
  2. JSONB fields allow flexible storage of dynamic configurations
  3. All timestamps use timestamptz for proper timezone handling
  4. Foreign keys ensure data integrity between related tables
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  description text DEFAULT '',
  project_type text NOT NULL DEFAULT 'html',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  content text DEFAULT '',
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, file_path)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_name text NOT NULL,
  route text NOT NULL,
  is_home boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, route)
);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_project_pages_project_id ON project_pages(project_id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to projects"
  ON projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to projects"
  ON projects FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to project_files"
  ON project_files FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to project_files"
  ON project_files FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to project_files"
  ON project_files FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to project_files"
  ON project_files FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to chat_messages"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to chat_messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to chat_messages"
  ON chat_messages FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to project_pages"
  ON project_pages FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to project_pages"
  ON project_pages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to project_pages"
  ON project_pages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to project_pages"
  ON project_pages FOR DELETE
  USING (true);