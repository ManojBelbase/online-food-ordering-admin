#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * 
 * This script analyzes the build output and provides insights
 * about bundle sizes, chunk distribution, and optimization opportunities.
 * 
 * Usage: node scripts/analyze-bundle.js
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Analyzing bundle...\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  const stats = {
    totalSize: 0,
    jsFiles: [],
    cssFiles: [],
    imageFiles: [],
    otherFiles: []
  };

  function scanDirectory(dir, relativePath = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativeFilePath = path.join(relativePath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath, relativeFilePath);
      } else {
        const size = stat.size;
        stats.totalSize += size;
        
        const ext = path.extname(file).toLowerCase();
        const fileInfo = {
          name: relativeFilePath,
          size: size,
          formattedSize: formatBytes(size)
        };
        
        if (ext === '.js') {
          stats.jsFiles.push(fileInfo);
        } else if (ext === '.css') {
          stats.cssFiles.push(fileInfo);
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
          stats.imageFiles.push(fileInfo);
        } else {
          stats.otherFiles.push(fileInfo);
        }
      }
    });
  }

  scanDirectory(DIST_DIR);

  // Sort files by size (largest first)
  stats.jsFiles.sort((a, b) => b.size - a.size);
  stats.cssFiles.sort((a, b) => b.size - a.size);
  stats.imageFiles.sort((a, b) => b.size - a.size);

  // Display results
  console.log('📊 Bundle Analysis Results');
  console.log('=' .repeat(50));
  console.log(`Total Bundle Size: ${formatBytes(stats.totalSize)}\n`);

  // JavaScript files
  console.log('📜 JavaScript Files:');
  console.log('-'.repeat(30));
  if (stats.jsFiles.length === 0) {
    console.log('  No JS files found');
  } else {
    stats.jsFiles.forEach(file => {
      console.log(`  ${file.formattedSize.padStart(8)} - ${file.name}`);
    });
  }
  console.log(`  Total JS: ${formatBytes(stats.jsFiles.reduce((sum, f) => sum + f.size, 0))}\n`);

  // CSS files
  console.log('🎨 CSS Files:');
  console.log('-'.repeat(30));
  if (stats.cssFiles.length === 0) {
    console.log('  No CSS files found');
  } else {
    stats.cssFiles.forEach(file => {
      console.log(`  ${file.formattedSize.padStart(8)} - ${file.name}`);
    });
  }
  console.log(`  Total CSS: ${formatBytes(stats.cssFiles.reduce((sum, f) => sum + f.size, 0))}\n`);

  // Image files
  console.log('🖼️  Image Files:');
  console.log('-'.repeat(30));
  if (stats.imageFiles.length === 0) {
    console.log('  No image files found');
  } else {
    stats.imageFiles.slice(0, 10).forEach(file => { // Show top 10
      console.log(`  ${file.formattedSize.padStart(8)} - ${file.name}`);
    });
    if (stats.imageFiles.length > 10) {
      console.log(`  ... and ${stats.imageFiles.length - 10} more`);
    }
  }
  console.log(`  Total Images: ${formatBytes(stats.imageFiles.reduce((sum, f) => sum + f.size, 0))}\n`);

  // Performance recommendations
  console.log('💡 Performance Recommendations:');
  console.log('-'.repeat(40));
  
  const largeJsFiles = stats.jsFiles.filter(f => f.size > 500 * 1024); // > 500KB
  if (largeJsFiles.length > 0) {
    console.log('⚠️  Large JavaScript files detected:');
    largeJsFiles.forEach(file => {
      console.log(`   - ${file.name} (${file.formattedSize}) - Consider code splitting`);
    });
  }

  const largeCssFiles = stats.cssFiles.filter(f => f.size > 100 * 1024); // > 100KB
  if (largeCssFiles.length > 0) {
    console.log('⚠️  Large CSS files detected:');
    largeCssFiles.forEach(file => {
      console.log(`   - ${file.name} (${file.formattedSize}) - Consider CSS optimization`);
    });
  }

  const largeImages = stats.imageFiles.filter(f => f.size > 200 * 1024); // > 200KB
  if (largeImages.length > 0) {
    console.log('⚠️  Large image files detected:');
    largeImages.forEach(file => {
      console.log(`   - ${file.name} (${file.formattedSize}) - Consider image optimization`);
    });
  }

  if (stats.totalSize > 5 * 1024 * 1024) { // > 5MB
    console.log('⚠️  Total bundle size is quite large. Consider:');
    console.log('   - Implementing lazy loading for routes');
    console.log('   - Using dynamic imports for heavy components');
    console.log('   - Optimizing images and assets');
    console.log('   - Tree shaking unused code');
  }

  if (largeJsFiles.length === 0 && largeCssFiles.length === 0 && largeImages.length === 0 && stats.totalSize < 2 * 1024 * 1024) {
    console.log('✅ Bundle looks well optimized!');
  }

  console.log('\n🚀 To improve performance further:');
  console.log('   - Use "npm run build -- --analyze" for detailed analysis');
  console.log('   - Enable gzip compression on your server');
  console.log('   - Consider using a CDN for static assets');
  console.log('   - Implement service worker for caching');
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
