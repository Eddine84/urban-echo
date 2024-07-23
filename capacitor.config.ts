import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'myApp',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:8100',
  },
};

export default config;
