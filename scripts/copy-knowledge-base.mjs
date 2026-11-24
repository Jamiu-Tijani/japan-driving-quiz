import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist/knowledge-base', { recursive: true });
await copyFile('knowledge-base/catalog.json','dist/knowledge-base/catalog.json');
