import { useState } from 'react';
import { X } from 'lucide-react';

interface AddPageModalProps {
  onClose: () => void;
  onAdd: (pageName: string, route: string) => void;
}

export function AddPageModal({ onClose, onAdd }: AddPageModalProps) {
  const [pageName, setPageName] = useState('');
  const [route, setRoute] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageName.trim() || !route.trim()) return;

    let formattedRoute = route.trim();
    if (!formattedRoute.startsWith('/')) {
      formattedRoute = '/' + formattedRoute;
    }

    onAdd(pageName.trim(), formattedRoute);
  };

  const handlePageNameChange = (value: string) => {
    setPageName(value);
    if (!route) {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setRoute(slug);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Add New Page</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Name
            </label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => handlePageNameChange(e.target.value)}
              placeholder="About Us"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route / URL Path
            </label>
            <input
              type="text"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="about-us"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Will be accessible at: /{route || 'page-route'}
            </p>
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
              disabled={!pageName.trim() || !route.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
