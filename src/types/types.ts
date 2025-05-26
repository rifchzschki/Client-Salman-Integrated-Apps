export interface Discussion {
  id: number;
  content: string;
  author: string;
  author_id: number | string | null;
  created_at: string | null; // Format: 'YYYY-MM-DD HH:mm:ss'
  updated_at: string | null; // Sama seperti created_at
}