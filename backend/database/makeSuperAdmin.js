const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const makeSuperAdmin = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-platform');
        console.log('MongoDB Connected.');

        const username = 'admin';
        const password = 'admin123';
        const role = 'superadmin';

        let admin = await Admin.findOne({ username });

        if (admin) {
            console.log('Admin already exists.');
            admin.role = role;
            // Optionally update password if you want reset
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
            await admin.save();
            console.log('Existing admin updated to superadmin with password reset.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            admin = new Admin({
                username,
                password: hashedPassword,
                role
            });
            await admin.save();
            console.log(`New superadmin created. Username: ${username}, Password: ${password}`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

makeSuperAdmin();
