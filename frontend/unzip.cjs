const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const zipFilePath = './src.zip';
const outputDirectory = './';

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

try {
  const zip = new AdmZip(zipFilePath);
  zip.extractAllTo(outputDirectory, true);
  console.log('✅ আনজিপ সফলভাবে সম্পন্ন হয়েছে!');
} catch (err) {
  console.error('❌ আনজিপ করতে সমস্যা হয়েছে:', err);
}
