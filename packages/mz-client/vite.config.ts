import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: [{ find: '~', replacement: path.resolve(__dirname, 'src') }],
    },
    server: {
      proxy: {
        '/base': {
          target: env.VITE_APP_TEST_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/base/, ''),
        },
      },
    },
  };
});
