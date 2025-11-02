#!/usr/bin/env node
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Module {
  name: string;
  path: string;
  type: 'directory' | 'file';
}

function scanDirectory(dir: string, baseDir: string): Module[] {
  const modules: Module[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      
      // Skip __pycache__ and hidden directories
      if (entry.startsWith('__') || entry.startsWith('.')) {
        continue;
      }
      
      const relativePath = relative(baseDir, fullPath);
      
      if (stats.isDirectory()) {
        modules.push({
          name: entry,
          path: relativePath,
          type: 'directory',
        });
        
        // Recursively scan subdirectories
        modules.push(...scanDirectory(fullPath, baseDir));
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error);
  }
  
  return modules;
}

async function main() {
  console.log('Scanning modules in src/alphanest...');
  
  try {
    // Path to the alphanest source directory
    const alphanestPath = join(__dirname, '..', '..', 'src', 'alphanest');
    
    let modules: Module[] = [];
    
    try {
      modules = scanDirectory(alphanestPath, alphanestPath);
      console.log(`✅ Found ${modules.length} modules/directories`);
    } catch (error) {
      console.error('Error scanning modules:', error);
      // Fallback data
      modules = [
        { name: 'core', path: 'core', type: 'directory' },
        { name: 'strategies', path: 'strategies', type: 'directory' },
        { name: 'data', path: 'data', type: 'directory' },
        { name: 'models', path: 'models', type: 'directory' },
        { name: 'utils', path: 'utils', type: 'directory' },
      ];
    }
    
    // Ensure output directory exists
    const outputDir = join(__dirname, '..', 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write modules to file
    const outputPath = join(outputDir, 'modules.json');
    writeFileSync(outputPath, JSON.stringify(modules, null, 2));
    
    console.log(`✅ Modules written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error scanning modules:', error);
    process.exit(1);
  }
}

main();
