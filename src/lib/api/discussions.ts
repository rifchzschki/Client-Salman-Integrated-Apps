const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

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
  
export async function postDiscussion(title: string, content: string) {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/discussions/post`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
      });
      console.log('Discussion posted successfully');
}
  
export async function deleteDiscussion(id: number) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/discussions/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete discussion');
    }
}
  
export async function editDiscussion(id: number, content: string) {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/discussions/edit/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
    });
}

export const getDiscussionDetail = async (id: number) => {
  const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/discussions/${id}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res.json();
};

export const postReply = async (discussionId: number, content: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discussions/${discussionId}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ content }),
  });
  return await res.json();
};
