import { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { PreviewFrame } from './components/PreviewFrame';
import { CodeEditor } from './components/CodeEditor';
import { ProjectHeader } from './components/ProjectHeader';
import { NewProjectModal } from './components/NewProjectModal';
import { LoadProjectModal } from './components/LoadProjectModal';
import { AddPageModal } from './components/AddPageModal';
import { Project, ProjectFile, ChatMessage } from './lib/supabase';
import {
  createProject,
  getProject,
  updateProject,
  getProjectFiles,
  saveProjectFile,
  getChatMessages,
  saveChatMessage,
  createProjectPage,
  getProjectPages,
} from './lib/database';
import { sendGeminiMessage, parseFilesFromResponse, GeminiMessage } from './lib/gemini';
import { exportProjectAsZip } from './lib/export';

function App() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'default' | 'click-to-edit' | 'editor'>('default');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showLoadProjectModal, setShowLoadProjectModal] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  useEffect(() => {
    if (previewMode === 'editor') {
      setShowCodeEditor(true);
    } else {
      setShowCodeEditor(false);
    }
  }, [previewMode]);

  const handleCreateProject = async (name: string, projectType: 'html' | 'nextjs' | 'astro') => {
    try {
      const project = await createProject(name, projectType);
      setCurrentProject(project);
      setProjectFiles([]);
      setChatMessages([]);
      setShowNewProjectModal(false);

      const initialFile = await saveProjectFile(
        project.id,
        'index.html',
        '<html><head><title>Welcome</title></head><body><h1>Welcome to your new project!</h1><p>Start chatting to build your website.</p></body></html>',
        'html'
      );
      setProjectFiles([initialFile]);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };

  const handleLoadProject = async (projectId: string) => {
    try {
      const project = await getProject(projectId);
      if (!project) {
        alert('Project not found');
        return;
      }

      const files = await getProjectFiles(projectId);
      const messages = await getChatMessages(projectId);

      setCurrentProject(project);
      setProjectFiles(files);
      setChatMessages(messages);
      setShowLoadProjectModal(false);
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project');
    }
  };

  const handleSaveProject = async () => {
    if (!currentProject) return;

    try {
      await updateProject(currentProject.id, {
        updated_at: new Date().toISOString(),
      });
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    }
  };

  const handleExport = async () => {
    if (!currentProject || projectFiles.length === 0) return;

    try {
      await exportProjectAsZip(currentProject.name, projectFiles);
    } catch (error) {
      console.error('Failed to export project:', error);
      alert('Failed to export project');
    }
  };

  const handleAddPage = async (pageName: string, route: string) => {
    if (!currentProject) return;

    try {
      await createProjectPage(currentProject.id, pageName, route, false);
      setShowAddPageModal(false);

      const fileName = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`;
      const newFile = await saveProjectFile(
        currentProject.id,
        fileName,
        `<html><head><title>${pageName}</title></head><body><h1>${pageName}</h1></body></html>`,
        'html'
      );

      setProjectFiles([...projectFiles, newFile]);
      alert(`Page "${pageName}" created successfully!`);
    } catch (error) {
      console.error('Failed to add page:', error);
      alert('Failed to add page');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentProject) {
      setShowNewProjectModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const userMessage = await saveChatMessage(currentProject.id, 'user', message);
      setChatMessages([...chatMessages, userMessage]);

      const geminiMessages: GeminiMessage[] = chatMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      geminiMessages.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await sendGeminiMessage(geminiMessages);

      const assistantMessage = await saveChatMessage(currentProject.id, 'assistant', response);
      setChatMessages(prev => [...prev, assistantMessage]);

      const parsedFiles = parseFilesFromResponse(response);

      if (parsedFiles.length > 0) {
        const updatedFiles = [...projectFiles];

        for (const file of parsedFiles) {
          const savedFile = await saveProjectFile(
            currentProject.id,
            file.path,
            file.content,
            file.type
          );

          const existingIndex = updatedFiles.findIndex(f => f.file_path === file.path);
          if (existingIndex >= 0) {
            updatedFiles[existingIndex] = savedFile;
          } else {
            updatedFiles.push(savedFile);
          }
        }

        setProjectFiles(updatedFiles);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleElementClick = async (selector: string) => {
    const message = `I clicked on the element: ${selector}. Please help me edit this element.`;
    await handleSendMessage(message);
  };

  const handleSaveFile = async (filePath: string, content: string) => {
    if (!currentProject) return;

    try {
      const fileType = filePath.split('.').pop() || 'txt';
      const savedFile = await saveProjectFile(currentProject.id, filePath, content, fileType);

      setProjectFiles(projectFiles.map(f => (f.file_path === filePath ? savedFile : f)));
      alert('File saved successfully!');
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <ProjectHeader
        project={currentProject}
        onNewProject={() => setShowNewProjectModal(true)}
        onLoadProject={() => setShowLoadProjectModal(true)}
        onSaveProject={handleSaveProject}
        onExport={handleExport}
        onAddPage={() => setShowAddPageModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-200">
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        <div className="w-1/2">
          <PreviewFrame
            files={projectFiles}
            previewMode={previewMode}
            onModeChange={setPreviewMode}
            onElementClick={handleElementClick}
            projectType={currentProject?.project_type || 'html'}
          />
        </div>
      </div>

      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {showLoadProjectModal && (
        <LoadProjectModal
          onClose={() => setShowLoadProjectModal(false)}
          onLoad={handleLoadProject}
        />
      )}

      {showAddPageModal && (
        <AddPageModal
          onClose={() => setShowAddPageModal(false)}
          onAdd={handleAddPage}
        />
      )}

      {showCodeEditor && (
        <CodeEditor
          files={projectFiles}
          onSaveFile={handleSaveFile}
          onClose={() => setPreviewMode('default')}
        />
      )}
    </div>
  );
}

export default App;
