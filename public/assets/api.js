window.API_ROOT = window.API_ROOT || 'http://localhost:3000/api';

async function apiFetch(path, opts) {
    const res = await fetch(`${window.API_ROOT}${path}`, opts);
	if (!res.ok) throw new Error('Request failed');
	const ct = res.headers.get('content-type') || '';
	return ct.includes('application/json') ? res.json() : res.text();
}

function setToken(token) {
	window.localStorage.setItem('jwt', token);
}

function getAuthHeaders() {
	const t = window.localStorage.getItem('jwt');
	return t ? { Authorization: `Bearer ${t}` } : {};
}

function isAuthed() {
    return Boolean(window.localStorage.getItem('jwt'));
}

function requireAuth() {
    if (!isAuthed()) {
        window.location.href = 'auth.html';
    }
}

function logout() {
    window.localStorage.removeItem('jwt');
    window.location.href = 'auth.html';
}

window.api = { fetch: apiFetch, setToken, getAuthHeaders, isAuthed, requireAuth, logout };

