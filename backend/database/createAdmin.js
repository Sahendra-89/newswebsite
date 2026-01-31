const readline = require('readline');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

const createAdmin = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-platform');
        console.log('MongoDB Connected.');

        console.log('\n--- Create New Admin User ---\n');

        const username = await askQuestion('Enter Username: ');
        const password = await askQuestion('Enter Password: ');
        const role = await askQuestion('Enter Role (superadmin/employee) [default: superadmin]: ') || 'superadmin';

        if (!username || !password) {
            console.log('Username and password are required.');
            process.exit(1);
        }

        const existing = await Admin.findOne({ username });
        if (existing) {
            console.log('Error: Admin with this username already exists.');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await new Admin({ username, password: hashedPassword, role }).save();
        console.log(`\nSuccess! Admin user '${username}' created with role '${role}'.`);

    } catch (error) {
        console.error('Error creating admin:', error.message);
    } finally {
        rl.close();
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin();
