const mongoose = require('mongoose');
const News = require('./models/News');
require('dotenv').config();

const checkNews = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-platform');
        console.log('Connected to DB');

        const articles = await News.find({});
        console.log(`Found ${articles.length} articles.`);
        articles.forEach(a => {
            console.log(`- [${a.language}] ${a.title} (Category: ${a.category}, Featured: ${a.featured})`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkNews();
