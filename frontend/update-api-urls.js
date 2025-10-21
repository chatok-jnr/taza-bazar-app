import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'src/pages/ConsumerMarketplace.jsx',
  'src/pages/ConsumerProfile.jsx',
  'src/pages/ConsumerRequests.jsx',
  'src/pages/FarmerDashboard.jsx',
  'src/pages/FarmerListing.jsx',
  'src/pages/FarmerMarketplace.jsx',
  'src/pages/FarmerProfile.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Add import if not present
  if (!content.includes("import { getApiUrl } from '../config/api'")) {
    // Find the last import line
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, "import { getApiUrl } from '../config/api';");
      content = lines.join('\n');
      modified = true;
      console.log(`✅ Added import to ${file}`);
    }
  }
  
  // Replace all fetch calls
  const originalContent = content;
  
  // Pattern 1: fetch(`http://127.0.0.1:8000/...`)
  content = content.replace(
    /fetch\(`http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^`]+)`\)/g,
    'fetch(getApiUrl(`$1`))'
  );
  
  // Pattern 2: fetch("http://127.0.0.1:8000/...")
  content = content.replace(
    /fetch\("http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^"]+)"\)/g,
    'fetch(getApiUrl("$1"))'
  );
  
  // Pattern 3: fetch('http://127.0.0.1:8000/...')
  content = content.replace(
    /fetch\('http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^']+)'\)/g,
    "fetch(getApiUrl('$1'))"
  );
  
  // Pattern 4: url = `http://127.0.0.1:8000/...`
  content = content.replace(
    /=\s*`http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^`]+)`/g,
    '= getApiUrl(`$1`)'
  );
  
  // Pattern 5: url = "http://127.0.0.1:8000/..."
  content = content.replace(
    /=\s*"http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^"]+)"/g,
    '= getApiUrl("$1")'
  );
  
  // Pattern 6: url = 'http://127.0.0.1:8000/...'
  content = content.replace(
    /=\s*'http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^']+)'/g,
    "= getApiUrl('$1')"
  );
  
  // Pattern 7: URLs in function calls or other contexts
  content = content.replace(
    /`http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^`]+)`/g,
    'getApiUrl(`$1`)'
  );
  
  content = content.replace(
    /"http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^"]+)"/g,
    'getApiUrl("$1")'
  );
  
  content = content.replace(
    /'http:\/\/127\.0\.0\.1:8000\/(api\/v1\/[^']+)'/g,
    "getApiUrl('$1')"
  );
  
  if (content !== originalContent) {
    modified = true;
    console.log(`✅ Updated fetch calls in ${file}`);
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Successfully updated ${file}\n`);
  } else {
    console.log(`ℹ️  No changes needed for ${file}\n`);
  }
});

console.log('🎉 All files processed!');
