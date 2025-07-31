import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {

        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI libraries
          'ui-vendor': ['@mantine/core', '@mantine/hooks', '@mantine/notifications', '@mantine/dropzone'],

          // State management
          'state-vendor': ['redux', 'react-redux', '@reduxjs/toolkit', 'redux-persist'],

          'utils-vendor': ['@tabler/icons-react', 'axios'],
        },

        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },

        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    chunkSizeWarningLimit: 1000,

    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, 
        drop_debugger: true,
      },
    },

    sourcemap: false,
  },

  // Development server optimizations
  server: {
    // HTTP/2 is automatically enabled when using HTTPS
    // To enable HTTPS (and thus HTTP/2), uncomment the following:
    // https: true,

    // Optimize HMR
    hmr: {
      overlay: true,
    },

    // Preload modules
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/pages/login/LoginPage.tsx',
        './src/layout/Layout.tsx',
      ],
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/notifications',
      '@reduxjs/toolkit',
      'react-redux',
    ],
    exclude: [
    ],
  },

  css: {
    devSourcemap: true,
  },
});
