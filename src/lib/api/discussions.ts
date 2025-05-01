const API_URL = 'http://localhost:8000/api';

export async function getDiscussions() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/discussions`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res.json();
}
  
export async function postDiscussion(content: string) {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/discussions`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      console.log('Discussion posted successfully');
}
  
export async function deleteDiscussion(id: number) {
    await fetch(`${API_URL}/discussions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
}
  
export async function editDiscussion(id: number, content: string) {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/discussions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
}