const http = require('http');

const postData = JSON.stringify({
    username: 'admin',
    password: 'adminpassword'
});

const setupOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/setup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};


function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

(async () => {
    try {
        console.log('--- Testing API ---');

        // 1. Setup Admin
        console.log('\n1. Setting up admin...');
        const setupRes = await makeRequest(setupOptions, postData);
        console.log('Status:', setupRes.statusCode);
        console.log('Body:', setupRes.body);

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await makeRequest(loginOptions, postData);
        console.log('Status:', loginRes.statusCode);
        console.log('Token received:', loginRes.body.token ? 'YES' : 'NO');

        if (!loginRes.body.token) {
            console.error('Login failed, stopping tests.');
            return;
        }
        const token = loginRes.body.token;

        // 3. Create News
        console.log('\n3. Creating News...');
        const newsData = JSON.stringify({
            title: 'Test News Article',
            content: 'This is a test article content.',
            category: 'Tech',
            image: 'https://via.placeholder.com/150'
        });
        const createOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/admin/news',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(newsData),
                'x-auth-token': token
            }
        };
        const createRes = await makeRequest(createOptions, newsData);
        console.log('Status:', createRes.statusCode);
        console.log('Created News Slug:', createRes.body.slug);

        // 4. Get all News
        console.log('\n4. Fetching all news...');
        const getOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/news',
            method: 'GET'
        };
        const getRes = await makeRequest(getOptions);
        console.log('Status:', getRes.statusCode);
        console.log('News Count:', getRes.body.length);


    } catch (err) {
        console.error('Test failed:', err);
    }
})();
