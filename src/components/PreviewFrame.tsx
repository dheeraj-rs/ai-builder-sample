import { useEffect, useRef, useState } from 'react';
import { Monitor, Smartphone, Tablet, RotateCw, Edit3, Eye, Code } from 'lucide-react';
import { ProjectFile } from '../lib/supabase';

interface PreviewFrameProps {
  files: ProjectFile[];
  previewMode: 'default' | 'click-to-edit' | 'editor';
  onModeChange: (mode: 'default' | 'click-to-edit' | 'editor') => void;
  onElementClick?: (element: string) => void;
  projectType: 'html' | 'nextjs' | 'astro';
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export function PreviewFrame({ files, previewMode, onModeChange, onElementClick, projectType }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    updatePreview();
  }, [files, projectType]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const indexFile = files.find(f =>
      f.file_path === 'index.html' ||
      f.file_path === 'src/pages/index.astro' ||
      f.file_path === 'pages/index.tsx'
    );

    if (!indexFile) {
      iframeRef.current.srcdoc = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; color: #666;">No preview available. Start chatting to create your website!</div>';
      return;
    }

    let htmlContent = indexFile.content;

    if (projectType === 'html') {
      const cssFiles = files.filter(f => f.file_type === 'css');
      const jsFiles = files.filter(f => f.file_type === 'js' && f.file_path !== indexFile.file_path);

      let stylesTags = '';
      cssFiles.forEach(file => {
        stylesTags += `<style>${file.content}</style>\n`;
      });

      let scriptTags = '';
      jsFiles.forEach(file => {
        scriptTags += `<script>${file.content}</script>\n`;
      });

      if (!htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('<html>', '<html><head></head>');
      }

      htmlContent = htmlContent.replace('</head>', `${stylesTags}</head>`);
      htmlContent = htmlContent.replace('</body>', `${scriptTags}</body>`);

      if (previewMode === 'click-to-edit') {
        const clickScript = `
          <script>
            document.addEventListener('click', (e) => {
              if (e.target.tagName !== 'A') {
                e.preventDefault();
                const tag = e.target.tagName;
                const className = e.target.className;
                const id = e.target.id;
                let selector = tag;
                if (id) selector += '#' + id;
                if (className) selector += '.' + className.split(' ').join('.');
                window.parent.postMessage({ type: 'element-click', selector }, '*');
              }
            });
          </script>
        `;
        htmlContent = htmlContent.replace('</body>', `${clickScript}</body>`);
      }
    }

    iframeRef.current.srcdoc = htmlContent;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    updatePreview();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'element-click' && onElementClick) {
        onElementClick(event.data.selector);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementClick]);

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded ${device === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded ${device === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded ${device === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onModeChange('default')}
            className={`px-3 py-1 text-sm rounded ${previewMode === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            Preview
          </button>
          <button
            onClick={() => onModeChange('click-to-edit')}
            className={`px-3 py-1 text-sm rounded ${previewMode === 'click-to-edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <Edit3 className="w-4 h-4 inline mr-1" />
            Click to Edit
          </button>
          <button
            onClick={() => onModeChange('editor')}
            className={`px-3 py-1 text-sm rounded ${previewMode === 'editor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <Code className="w-4 h-4 inline mr-1" />
            Editor
          </button>

          <button
            onClick={handleRefresh}
            className="p-2 rounded text-gray-600 hover:bg-gray-100"
            title="Refresh preview"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex justify-center items-start p-4">
        <div
          style={{
            width: deviceWidths[device],
            maxWidth: '100%',
            transition: 'width 0.3s ease',
          }}
          className="h-full bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
