import { supabase, Project, ProjectFile, ChatMessage, ProjectPage } from './supabase';

export async function createProject(name: string, projectType: 'html' | 'nextjs' | 'astro' = 'html'): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name,
      project_type: projectType,
      description: '',
      settings: {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId);

  if (error) throw error;
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw error;
}

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveProjectFile(
  projectId: string,
  filePath: string,
  content: string,
  fileType: string
): Promise<ProjectFile> {
  const { data, error } = await supabase
    .from('project_files')
    .upsert(
      {
        project_id: projectId,
        file_path: filePath,
        content,
        file_type: fileType,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id,file_path' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  const { data, error } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .order('file_path');

  if (error) throw error;
  return data || [];
}

export async function deleteProjectFile(projectId: string, filePath: string): Promise<void> {
  const { error } = await supabase
    .from('project_files')
    .delete()
    .eq('project_id', projectId)
    .eq('file_path', filePath);

  if (error) throw error;
}

export async function saveChatMessage(
  projectId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata: Record<string, unknown> = {}
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      project_id: projectId,
      role,
      content,
      metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getChatMessages(projectId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createProjectPage(
  projectId: string,
  pageName: string,
  route: string,
  isHome: boolean = false
): Promise<ProjectPage> {
  const { data: existingPages } = await supabase
    .from('project_pages')
    .select('order_index')
    .eq('project_id', projectId)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrderIndex = existingPages && existingPages.length > 0 ? existingPages[0].order_index + 1 : 0;

  const { data, error } = await supabase
    .from('project_pages')
    .insert({
      project_id: projectId,
      page_name: pageName,
      route,
      is_home: isHome,
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProjectPages(projectId: string): Promise<ProjectPage[]> {
  const { data, error } = await supabase
    .from('project_pages')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function updateProjectPage(pageId: string, updates: Partial<ProjectPage>): Promise<void> {
  const { error } = await supabase
    .from('project_pages')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', pageId);

  if (error) throw error;
}

export async function deleteProjectPage(pageId: string): Promise<void> {
  const { error } = await supabase.from('project_pages').delete().eq('id', pageId);
  if (error) throw error;
}
