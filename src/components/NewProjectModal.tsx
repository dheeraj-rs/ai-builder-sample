import { useState } from 'react';
import { X } from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (name: string, type: 'html' | 'nextjs' | 'astro') => void;
}

export function NewProjectModal({ onClose, onCreate }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<'html' | 'nextjs' | 'astro'>('html');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), projectType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Website"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="html"
                  checked={projectType === 'html'}
                  onChange={(e) => setProjectType(e.target.value as 'html')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">HTML/CSS/JS</div>
                  <div className="text-sm text-gray-600">Static website with plain HTML, CSS, and JavaScript</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="nextjs"
                  checked={projectType === 'nextjs'}
                  onChange={(e) => setProjectType(e.target.value as 'nextjs')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Next.js</div>
                  <div className="text-sm text-gray-600">React-based framework with TypeScript</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="astro"
                  checked={projectType === 'astro'}
                  onChange={(e) => setProjectType(e.target.value as 'astro')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Astro</div>
                  <div className="text-sm text-gray-600">Modern static site builder</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
