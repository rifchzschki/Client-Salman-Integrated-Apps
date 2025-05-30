export interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
  author_id: number | string | null;
  created_at: string | null; // Format: 'YYYY-MM-DD HH:mm:ss'
  updated_at: string | null; // Sama seperti created_at
}

export interface Reply {
  id: number;
  content: string;
  author: string;
  created_at: string | null; // Format: 'YYYY-MM-DD HH:mm:ss'
}