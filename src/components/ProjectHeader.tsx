import { useState } from 'react';
import { Download, FolderOpen, Save, Plus, Settings } from 'lucide-react';
import { Project } from '../lib/supabase';

interface ProjectHeaderProps {
  project: Project | null;
  onNewProject: () => void;
  onLoadProject: () => void;
  onSaveProject: () => void;
  onExport: () => void;
  onAddPage: () => void;
}

export function ProjectHeader({
  project,
  onNewProject,
  onLoadProject,
  onSaveProject,
  onExport,
  onAddPage,
}: ProjectHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">WebBuilder AI</h1>
          {project && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{project.name}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{project.project_type}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>

          <button
            onClick={onLoadProject}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Load
          </button>

          {project && (
            <>
              <button
                onClick={onSaveProject}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>

              <button
                onClick={onAddPage}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Page
              </button>

              <button
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
