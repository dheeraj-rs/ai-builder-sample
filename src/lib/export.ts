import { ProjectFile } from './supabase';
import JSZip from 'jszip';

export async function exportProjectAsZip(projectName: string, files: ProjectFile[]): Promise<void> {
  const zip = new JSZip();

  files.forEach(file => {
    zip.file(file.file_path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
