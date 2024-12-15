const backend_url = "http://localhost:3000/api"

export async function login(email, password) {
    const response = await fetch(`${backend_url}/user/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        throw new Error('Erreur de login');
    }

    return response.json();
}

export async function register(email, name, password) {
    const response = await fetch(`${backend_url}/user/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, name, password })
    });
    if (!response.ok) {
        throw new Error('Erreur d\'inscription');
    }
    return response.json();
}

export async function getUserInfo(token) {
    const res = await fetch(`${backend_url}/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) {
        throw new Error('Erreur fetching user info');
    }
    return res.json();
}

export async function getUserById(id, token) {
    const res = await fetch(`${backend_url}/user/${id}`,
        {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    if(!res.ok) {
        throw new Error('Erreur fetching user info');
    }
    return res.json();
}

export async function updateUser(token, { email, name, password }) {
    const body = { email, name };
    if (password) {
        body.password = password;
    }

    const res = await fetch(`${backend_url}/user`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if(!res.ok) {
        throw new Error('Erreur lors de la mise à jour');
    }
    return res.json();
}

export async function deleteUser(token) {
    const res = await fetch(`${backend_url}/user`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) {
        throw new Error('Erreur lors de la suppression du compte');
    }
    return res.json();
}

export async function getMessages(conv_id, token) {
    const res = await fetch(`${backend_url}/messages/conversation/${conv_id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des messages');
    }
    return res.json();
}

export async function createMessage(conv_id, content, token) {
    const res = await fetch(`${backend_url}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conv_id, content }),
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la création du message');
    }
    return res.json();
}

export async function updateMessage(id, content, token) {
    const res = await fetch(`${backend_url}/messages/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du message');
    }
    return res.json();
}

export async function deleteMessage(id, token) {
    const res = await fetch(`${backend_url}/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la suppression du message');
    }
    return res.json();
}

export async function getDiscussion(token) {
    const res = await fetch(`${backend_url}/discussions`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) {
        throw new Error('Erreur fetching conversations');
    }
    return res.json();
}

export async function createConversation(title, token) {
    const res = await fetch(`${backend_url}/discussions/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la discussion');
    }
    return res.json();
}

export async function updateDiscussion(id, title, token) {
    const res = await fetch(`${backend_url}/discussions/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la discussion');
    }
    return res.json();
}

export async function deleteDiscussion(id, token) {
    const res = await fetch(`${backend_url}/discussions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de la discussion');
    }
    return res.json();
}

export async function joinDiscussion(user_id, discussion_id, token) {
    const res = await fetch(`${backend_url}/discussions/join`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, discussion_id }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la demande de rejoindre la discussion');
    }
    return res.json();
}

export async function getNewJoinRequests(conv_id, creator_id, token) {
    const res = await fetch(`${backend_url}/discussions/joinRequests?conv_id=${conv_id}&creator_id=${creator_id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des demandes de rejoindre la discussion');
    }
    return res.json();
}

export async function acceptJoin(conv_id, user_id, decision, token) {
    const res = await fetch(`${backend_url}/discussions/acceptJoin`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conv_id, user_id, decision }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors du traitement de la demande de rejoindre la discussion');
    }
    return res.json();
}

export async function getConversationDetails(id, token) {
    const res = await fetch(`${backend_url}/discussions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des détails de la discussion');
    }
    return res.json();
}
