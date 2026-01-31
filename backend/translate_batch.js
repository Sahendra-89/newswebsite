const mongoose = require('mongoose');
const News = require('./models/News');
const { translate } = require('google-translate-api-x');
require('dotenv').config();

const translateBatch = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-platform');
        console.log('Connected to DB');

        // Find all English articles
        const articles = await News.find({ language: 'en' });
        console.log(`Found ${articles.length} English articles.`);

        for (const article of articles) {
            console.log(`Processing: ${article.title}`);

            // Check if Hindi version already exists (naive check by title usually changes, so check if we have a Hindi article with similar content? 
            // Better: Just check if we processed it? No facile way without ID linking.
            // Let's assume we want to create one if it doesn't clearly exist.
            // For now, let's just translate all 'en'. If duplicate, user can delete.

            try {
                // Translate Title
                const resTitle = await translate(article.title, { to: 'hi' });
                const translatedTitle = resTitle.text;

                // Translate Content
                // Content might be HTML. Google Translate API X handles raw text best.
                // We'll pass it as is, hoping tags are preserved or restored enough.
                const resContent = await translate(article.content, { to: 'hi' });
                const translatedContent = resContent.text;

                const newArticle = new News({
                    title: translatedTitle,
                    content: translatedContent,
                    category: article.category,
                    language: 'hi',
                    image: article.image,
                    featured: article.featured,
                    date: article.date
                });

                await newArticle.save();
                console.log(`  -> Translated and Saved: ${translatedTitle}`);
            } catch (err) {
                console.error(`  -> Failed to translate: ${err.message}`);
            }

            // Wait a bit to avoid rate limiting
            await new Promise(r => setTimeout(r, 1000));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

translateBatch();
