#!/usr/bin/env node
import { copyFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log('Copying Mermaid diagrams to public/diagrams...');
  
  try {
    const mermaidDir = join(__dirname, '..', '..', 'mermaid');
    const outputDir = join(__dirname, '..', 'public', 'diagrams');
    
    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true });
    
    if (!existsSync(mermaidDir)) {
      console.error(`❌ Mermaid directory not found: ${mermaidDir}`);
      process.exit(1);
    }
    
    // Get all .mmd files
    const files = readdirSync(mermaidDir).filter(f => f.endsWith('.mmd'));
    
    console.log(`Found ${files.length} diagram files`);
    
    // Copy each file
    for (const file of files) {
      const sourcePath = join(mermaidDir, file);
      const destPath = join(outputDir, file);
      
      copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file}`);
    }
    
    console.log(`✅ All diagrams copied to ${outputDir}`);
  } catch (error) {
    console.error('❌ Error copying diagrams:', error);
    process.exit(1);
  }
}

main();
