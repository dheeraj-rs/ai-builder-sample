import { useState } from 'react';
import { ProjectFile } from '../lib/supabase';
import { File, Folder, X, Save } from 'lucide-react';

interface CodeEditorProps {
  files: ProjectFile[];
  onSaveFile: (filePath: string, content: string) => Promise<void>;
  onClose: () => void;
}

export function CodeEditor({ files, onSaveFile, onClose }: CodeEditorProps) {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(files[0] || null);
  const [editedContent, setEditedContent] = useState(selectedFile?.content || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file);
    setEditedContent(file.content);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setIsSaving(true);
    try {
      await onSaveFile(selectedFile.file_path, editedContent);
    } finally {
      setIsSaving(false);
    }
  };

  const organizeFiles = () => {
    const organized: Record<string, ProjectFile[]> = {};

    files.forEach(file => {
      const parts = file.file_path.split('/');
      const folder = parts.length > 1 ? parts[0] : 'root';

      if (!organized[folder]) {
        organized[folder] = [];
      }
      organized[folder].push(file);
    });

    return organized;
  };

  const organizedFiles = organizeFiles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Code Editor</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-2">
              {Object.entries(organizedFiles).map(([folder, folderFiles]) => (
                <div key={folder} className="mb-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-700">
                    <Folder className="w-4 h-4" />
                    {folder}
                  </div>
                  <div className="ml-4">
                    {folderFiles.map(file => (
                      <button
                        key={file.id}
                        onClick={() => handleFileSelect(file)}
                        className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded hover:bg-gray-200 ${
                          selectedFile?.id === file.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <File className="w-3 h-3" />
                        {file.file_path.split('/').pop()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedFile ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                  <span className="text-sm font-medium">{selectedFile.file_path}</span>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || editedContent === selectedFile.content}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
                  spellCheck={false}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a file to edit
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
