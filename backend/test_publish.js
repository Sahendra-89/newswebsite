const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
let token = '';

const login = async () => {
    try {
        const res = await axios.post(`${API_URL}/admin/login`, {
            username: 'employee',
            password: 'password123'
        });
        token = res.data.token;
        console.log('Login successful. Token acquired.');
    } catch (err) {
        console.error('Login failed:', err.response?.data || err.message);
        process.exit(1);
    }
};

const testPublish = async () => {
    await login();

    const form = new FormData();
    form.append('title', 'Test Article for Debugging');
    form.append('content', '<p>This is a test article content.</p>');
    form.append('category', 'General');
    form.append('language', 'en');
    form.append('featured', 'false');
    form.append('date', new Date().toISOString().split('T')[0]);

    try {
        // 1. Create Article
        await axios.post(`${API_URL}/admin/news`, form, {
            headers: {
                ...form.getHeaders(),
                'x-auth-token': token
            }
        });
        console.log('1. Main article created successfully.');

        // 2. Test Translation
        console.log('2. Testing Translation Endpoint...');
        const transRes = await axios.post(`${API_URL}/admin/translate`, {
            title: 'Test Article for Debugging',
            content: '<p>This is a test article content.</p>',
            targetLang: 'hi'
        }, {
            headers: { 'x-auth-token': token }
        });
        console.log('Translation Result Title:', transRes.data.title);

    } catch (err) {
        console.error('Error during test:', err.response?.data || err.message);
    }
};

testPublish();
