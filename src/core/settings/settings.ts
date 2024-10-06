import { config } from 'dotenv';
config({ path: '.development.env' });

export const SETTINGS = {
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/api/blogs',
        POSTS: '/api/posts',
        COMMENTS: '/api/comments',
        TESTING: '/api/testing/all-data',
        USERS: '/api/users',
        AUTH: '/api/auth',
        SECURITY: '/api/security',
        API_URL: process.env.API_URL,
        MONGODB: process.env.MONGO_URI as string
    },
    VARIABLES: {
        ADMIN: process.env.ADMIN || 'admin:qwerty',
        JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS,
        JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH,
    }
}
