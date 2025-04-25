const API_URL = 'http://localhost:8000/api';

export async function getDiscussions() {
    const res = await fetch(`${API_URL}/discussions`, {credentials: 'include' });
    return res.json();
}
  
export async function postDiscussion(content: string) {
    await fetch(`${API_URL}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
}
  
export async function deleteDiscussion(id: number) {
    await fetch(`${API_URL}/discussions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
}
  
export async function editDiscussion(id: number, content: string) {
    await fetch(`${API_URL}/discussions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
}