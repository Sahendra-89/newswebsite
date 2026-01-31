export interface Article {
    _id: string;
    title: string;
    content: string;
    category: string;
    language: string;
    featured: boolean;
    image?: string;
    imageUrl?: string; // Legacy support if needed
    date: string;
    excerpt?: string; // Optional if computed
    // SEO
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
}

export interface Video {
    _id: string;
    title: string;
    url: string;
    description?: string;
    views?: number;
    createdAt: string;
}

export interface Category {
    _id: string;
    name: string;
}

export interface User {
    _id: string;
    username: string;
    email?: string;
    role: string;
}

export interface VideoSettings {
    channelName: string;
    channelUrl: string;
    channelSubscribers: string;
    adBannerImage?: string;
    adBannerUrl?: string;
}

export interface Page {
    _id: string;
    title: string;
    slug: string;
    content: string; // HTML
    metaDescription?: string;
    updatedAt: string;
}

