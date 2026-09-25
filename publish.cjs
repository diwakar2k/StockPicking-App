const { spawn } = require('child_process');

const domain = 'alpha-selector-india-' + Math.random().toString(36).substring(2, 8) + '.surge.sh';
const distPath = './dist';

console.log(`Publishing ${distPath} to ${domain}...`);

const surge = spawn('npx.cmd', ['surge', distPath, domain], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

surge.stdout.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);

  if (str.toLowerCase().includes('email:')) {
    surge.stdin.write('diwakar_feedback_2026@gmail.com\n');
  } else if (str.toLowerCase().includes('password:')) {
    surge.stdin.write('AlphaPass2026!#\n');
  }
});

surge.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

surge.on('close', (code) => {
  console.log(`\nSurge process exited with code ${code}`);
  if (code === 0) {
    console.log(`\n========================================`);
    console.log(`SUCCESS: Published to https://${domain}`);
    console.log(`Private Link: https://${domain}?access=alpha-feedback-2026`);
    console.log(`========================================\n`);
  }
});
