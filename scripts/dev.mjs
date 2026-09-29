import { spawn } from 'node:child_process';
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const dev = spawn(npmCommand, ['--workspace', 'supportbridge-frontend', 'run', 'dev'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: process.env.PORT ?? '5173', BASE_PATH: process.env.BASE_PATH ?? '/' },
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

dev.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 1)));