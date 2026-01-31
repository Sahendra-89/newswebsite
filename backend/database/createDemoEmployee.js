const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const createDemoEmployee = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-platform');
        console.log('Database connected.');

        const username = 'employee';
        const password = 'password123';

        // Check if exists
        const exists = await Admin.findOne({ username });
        if (exists) {
            console.log('Demo employee already exists.');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create with 'employee' role
        await Admin.create({
            username,
            password: hashedPassword,
            role: 'employee'
        });

        console.log(`Demo employee created. Username: ${username}, Password: ${password}`);
    } catch (err) {
        console.error('Error creating demo employee:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createDemoEmployee();
