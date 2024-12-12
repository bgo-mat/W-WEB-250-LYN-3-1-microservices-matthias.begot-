export async function login(email, password) {
    const response = await fetch('http://localhost:8080/login', {
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
    const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, name, password })
    });
    if (!response.ok) {
        throw new Error('Erreur d\'inscription');
    }
    return response.json();
}

export async function fetchConversations(token) {
    const res = await fetch('/api/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) {
        throw new Error('Erreur fetching conversations');
    }
    return res.json();
}

export async function fetchMessages(token, conversationId) {
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) {
        throw new Error('Erreur fetching messages');
    }
    return res.json();
}

export async function getUserInfo(token) {
    const res = await fetch('http://localhost:8080/user', {
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

    const res = await fetch('http://localhost:8080/user', {
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
    const res = await fetch('http://localhost:8080/user', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) {
        throw new Error('Erreur lors de la suppression du compte');
    }
    return res.json();
}
