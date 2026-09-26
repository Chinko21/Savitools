import test from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

test('SiteHeader import guard: ensures no app page imports SiteHeader directly', () => {
  const appDir = path.join(process.cwd(), 'src/app');
  if (!fs.existsSync(appDir)) {
    return;
  }
  const files = scanDirectory(appDir);
  const violations: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    if (
      content.includes('@/components/layout/site-header') ||
      content.includes('@/components/site-header')
    ) {
      violations.push(file);
    }
  }

  assert.deepEqual(violations, []);
});
