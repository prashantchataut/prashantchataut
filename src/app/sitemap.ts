import { MetadataRoute } from 'next';
import { posts } from '@/data/posts';
export default function sitemap(): MetadataRoute.Sitemap {
    return ['', '/now', '/writes', ...posts.map(post => `/writes/${post.slug}`)].map(path => ({ url: `https://knowprashant.vercel.app${path}`, lastModified: new Date(), changeFrequency: 'monthly', priority: path === '' ? 1 : .5 }));
}
