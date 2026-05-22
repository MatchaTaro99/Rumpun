import { spawn } from 'node:child_process';

const tasks = [
  ['backend', ['run', 'dev', '--workspace', 'backend']],
  ['frontend', ['run', 'dev', '--workspace', 'frontend']],
];

const children = tasks.map(([name, args]) => {
  const child = spawn('npm', args, {
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code, signal) => {
    if (signal || (typeof code === 'number' && code !== 0)) {
      shutdown(signal ?? 'SIGTERM', code ?? 1);
    }
  });

  child.on('error', () => shutdown('SIGTERM', 1));
  return [name, child];
});

let shuttingDown = false;

function shutdown(signal, exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const [, child] of children) {
    child.kill(signal);
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

