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

const resetPassword = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-platform');
        console.log('Database connected.');

        console.log('\n--- Reset Admin Password ---\n');

        const username = await askQuestion('Enter Username of Admin: ');

        // Check if exists
        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log(`Error: Admin user '${username}' not found.`);
            process.exit(1);
        }

        const newPassword = await askQuestion('Enter New Password: ');

        if (!newPassword) {
            console.log('Password cannot be empty.');
            process.exit(1);
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        console.log(`\nSuccess! Password for '${username}' has been updated.`);

    } catch (error) {
        console.error('Error resetting password:', error.message);
    } finally {
        rl.close();
        await mongoose.disconnect();
        process.exit(0);
    }
};

resetPassword();
