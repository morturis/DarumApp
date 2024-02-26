import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.darumapp',
  appName: 'DarumApp',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
