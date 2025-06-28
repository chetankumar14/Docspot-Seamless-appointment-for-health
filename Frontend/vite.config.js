import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Use the React plugin
  // Removed the problematic esbuild.loader configuration.
  // The @vitejs/plugin-react should handle JSX transformation for .js files by default.
  // If you still face issues with .js files not being parsed as JSX after this change,
  // ensure your React components are named with .jsx or .tsx extensions.
});
