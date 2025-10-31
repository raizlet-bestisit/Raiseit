import fs from 'fs';

// Get environment variables
const Groq_Api_Key=process.env.GROQ_AI_API_KEY
// Check required variables
if (!firebaseApiKey) {
  console.error('❌ FIREBASE_API_KEY is not set!');
  process.exit(1);
}

if (!sheetsApiKey) {
  console.error('❌ GOOGLE_SHEETS_API_KEY is not set!');
  process.exit(1);
}

// Files to process
const filesToProcess = [
  'functions\api\groq.js',
];

filesToProcess.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace Firebase API key
      content = content.replace(/\$\{FIREBASE_API_KEY\}/g, firebaseApiKey);
      
      // Replace Google Sheets API key (only in feed.js)
      if (filePath.includes('feed.js')) {
        content = content.replace(/\$\{GOOGLE_SHEETS_API_KEY\}/g, sheetsApiKey);
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Processed secrets in ${filePath}`);
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('✅ All secrets have been replaced!');