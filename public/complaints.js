const API_ROOT = (window.API_ROOT || 'http://localhost:3000') + '/api';
const API_COMPLAINTS = API_ROOT + '/complaints';
const API_AUTH = API_ROOT + '/auth';
const API_SCHEDULES = API_ROOT + '/schedules';
const API_RATINGS = API_ROOT + '/ratings';

async function fetchJSON(url, options) {
	const res = await fetch(url, options);
	if (!res.ok) throw new Error('Request failed');
	return res.json();
}

async function loadComplaints() {
	try {
    const items = await fetchJSON(`${API_COMPLAINTS}?page=1&pageSize=20`);
		const list = document.getElementById('list');
		list.innerHTML = '';
		for (const c of items) {
			const card = document.createElement('div');
			card.className = 'card';
			card.innerHTML = `<strong>${c.area}</strong><br/>${c.description}<br/><small>${new Date(c.created_at).toLocaleString()}</small>`;
			if (c.s3_image_key) {
				// If your bucket has public access blocked, serve via a backend proxy or CloudFront signed URLs.
				const img = document.createElement('img');
				img.className = 'thumb';
				img.src = `https://${window.S3_PUBLIC_BUCKET || 'your-upload-bucket'}.s3.${window.AWS_REGION || 'ap-south-1'}.amazonaws.com/${c.s3_image_key}`;
				card.appendChild(img);
			}
			list.appendChild(card);
		}
	} catch (e) {
		console.error(e);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('complaintForm');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const area = document.getElementById('area').value.trim();
		const description = document.getElementById('description').value.trim();
		const image = document.getElementById('image').files[0];
		const msg = document.getElementById('messages');
		msg.textContent = '';

		let s3_key = null;
		try {
			if (image) {
				const qs = new URLSearchParams({ filename: image.name, contentType: image.type || 'application/octet-stream' });
                const { url, key } = await fetchJSON(`${API_COMPLAINTS}/upload-url?` + qs.toString());
				const putRes = await fetch(url, { method: 'PUT', body: image, headers: { 'Content-Type': image.type || 'application/octet-stream' } });
				if (!putRes.ok) throw new Error('Upload failed');
				s3_key = key;
			}

            await fetchJSON(`${API_COMPLAINTS}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ user_id: 1, area, description, s3_key }),
			});

			msg.textContent = 'Complaint submitted successfully!';
			form.reset();
			loadComplaints();
		} catch (err) {
			console.error(err);
			msg.textContent = 'Failed to submit complaint.';
		}
	});

	loadComplaints();
});

// Auth: signup/login
document.addEventListener('DOMContentLoaded', () => {
    const authMsg = document.getElementById('authMsg');
    const signup = document.getElementById('signupForm');
    const login = document.getElementById('loginForm');
    signup.addEventListener('submit', async (e) => {
        e.preventDefault();
        authMsg.textContent = '';
        const body = {
            name: document.getElementById('su_name').value.trim(),
            email: document.getElementById('su_email').value.trim(),
            phone: document.getElementById('su_phone').value.trim(),
            password: document.getElementById('su_password').value,
        };
        try {
            await fetchJSON(`${API_AUTH}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            authMsg.textContent = 'Signup successful. You can now log in.';
        } catch (e) {
            authMsg.textContent = 'Signup failed.';
        }
    });
    login.addEventListener('submit', async (e) => {
        e.preventDefault();
        authMsg.textContent = '';
        try {
            const data = await fetchJSON(`${API_AUTH}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById('li_email').value.trim(), password: document.getElementById('li_password').value }) });
            window.localStorage.setItem('jwt', data.token);
            authMsg.textContent = 'Logged in.';
        } catch (e) {
            authMsg.textContent = 'Login failed.';
        }
    });
});

// Schedule search
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scheduleSearch');
    const list = document.getElementById('schedulesList');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const area = document.getElementById('sch_area').value.trim();
        const day = document.getElementById('sch_day').value;
        const qs = new URLSearchParams();
        if (area) qs.set('area', area);
        if (day) qs.set('day', day);
        try {
            const rows = await fetchJSON(`${API_SCHEDULES}?${qs.toString()}`);
            list.innerHTML = rows.map(r => `<div class="card"><strong>${r.area}</strong> - ${r.day_of_week} (${r.time_window})</div>`).join('');
        } catch (e) {
            list.textContent = 'Failed to fetch schedules';
        }
    });
});

// Ratings
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ratingForm');
    const list = document.getElementById('ratingsList');
    async function load(area) {
        const qs = area ? `?area=${encodeURIComponent(area)}` : '';
        try {
            const rows = await fetchJSON(`${API_RATINGS}${qs}`);
            list.innerHTML = rows.map(r => `<div class="card"><strong>${r.area}</strong> - ${r.rating}/5<br/>${r.comment || ''}<br/><small>${new Date(r.created_at).toLocaleString()}</small></div>`).join('');
        } catch (e) {
            list.textContent = 'Failed to load ratings';
        }
    }
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const area = document.getElementById('rt_area').value.trim();
        const rating = parseInt(document.getElementById('rt_rating').value, 10);
        const comment = document.getElementById('rt_comment').value.trim();
        try {
            await fetchJSON(`${API_RATINGS}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 1, area, rating, comment }) });
            form.reset();
            load(area);
        } catch (e) {
            list.textContent = 'Failed to submit rating';
        }
    });
    load('');
});

