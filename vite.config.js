import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    optimizeDeps: {
        include: ['@emoji-mart/data', '@emoji-mart/react'],
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
