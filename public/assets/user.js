// User management utilities
function getCurrentUserId() {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    
    try {
        // Decode JWT token to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub; // 'sub' contains the user ID
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
}

function getCurrentUserName() {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name;
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
}

window.user = { getCurrentUserId, getCurrentUserName };
