#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Verifying build outputs...\n');

const checks = [
  { path: 'dist/index.js', desc: 'Server bundle' },
  { path: 'dist/public/index.html', desc: 'Client HTML' },
  { path: 'dist/public/assets', desc: 'Client assets directory', isDir: true },
];

let allPassed = true;

checks.forEach(({ path: checkPath, desc, isDir }) => {
  const fullPath = path.resolve(rootDir, checkPath);
  const exists = fs.existsSync(fullPath);
  const icon = exists ? '✅' : '❌';
  
  if (!exists) {
    allPassed = false;
  }
  
  if (isDir && exists) {
    const files = fs.readdirSync(fullPath);
    console.log(`${icon} ${desc}: ${fullPath} (${files.length} files)`);
  } else {
    const size = exists ? (fs.statSync(fullPath).size / 1024).toFixed(2) + ' KB' : 'N/A';
    console.log(`${icon} ${desc}: ${fullPath} (${size})`);
  }
});

console.log('\n📊 Build verification:', allPassed ? '✅ PASSED' : '❌ FAILED');

if (!allPassed) {
  console.error('\n❌ Build verification failed! Some required files are missing.');
  process.exit(1);
}
