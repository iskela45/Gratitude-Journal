/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'fs';

function isUbuntuBased(): boolean {
  try {
    const content = readFileSync('/etc/os-release', 'utf8');
    return /^(ID|ID_LIKE)=.*ubuntu/m.test(content);
  } catch {
    return false;
  }
}

const ubuntuBased = isUbuntuBased();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 40_000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: true,
    locale: 'en-US',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(ubuntuBased ? {} : { launchOptions: { executablePath: '/usr/bin/chromium' } }),
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        ...(ubuntuBased ? {} : { channel: 'firefox' }),
      },
    },
  ],
  expect: {
    toHaveScreenshot: { threshold: 0.1, maxDiffPixels: 10 },
    toMatchSnapshot: { threshold: 0.1, maxDiffPixels: 10 },
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
    {
      command: 'bash -c "cd ../backend && ./venv/bin/python manage.py runserver"',
      url: 'http://localhost:8000/api/entries/',
      reuseExistingServer: true,
    },
  ],
});
