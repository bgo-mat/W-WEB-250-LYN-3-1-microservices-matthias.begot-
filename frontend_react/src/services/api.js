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

export async function fetchConversations(token) {
    const res = await fetch('/api/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) {
        throw new Error('Erreur fetching conversations');
    }
    return res.json();
}

export async function getMessages(conv_id, token) {
    const res = await fetch(`http://localhost:8080/messages/conversation/${conv_id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des messages');
    }
    return res.json();
}

export async function createMessage(conv_id, content, token) {
    const res = await fetch('http://localhost:8080/messages', {
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
    const res = await fetch(`http://localhost:8080/messages/${id}`, {
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
    const res = await fetch(`http://localhost:8080/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la suppression du message');
    }
    return res.json();
}
