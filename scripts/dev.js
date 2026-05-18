import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const clientPort = process.env.DEV_CLIENT_PORT || '3100';
const apiPort = process.env.DEV_API_PORT || '3101';
const childProcesses = [];
let shuttingDown = false;

function startProcess(name, args, env = {}) {
  const child = spawn(npmCommand, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...env,
    },
    stdio: 'inherit',
    shell: isWindows,
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`[dev] ${name} exited with ${reason}`);
    shutdown(code ?? 1);
  });

  child.on('error', (error) => {
    console.error(`[dev] Failed to start ${name}: ${error.message}`);
    shutdown(1);
  });

  childProcesses.push(child);
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of childProcesses) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log(`[dev] Starting API server on port ${apiPort} and Vite on port ${clientPort}...`);

startProcess('API server', ['run', 'dev:server'], {
  DEV_API_PORT: apiPort,
  PORT: apiPort,
});
startProcess('Vite client', ['run', 'dev:client'], {
  DEV_CLIENT_PORT: clientPort,
  DEV_API_PORT: apiPort,
});
