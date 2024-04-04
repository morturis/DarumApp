import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.darumApp',
  appName: 'DarumApp',
  webDir: 'dist/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
