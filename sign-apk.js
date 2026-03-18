const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration - CHANGE THESE
const config = {
  apkFile: 'app.apk',
  keystoreFile: 'my-release-key.keystore',
  keystorePass: 'your-password',
  keyAlias: 'alias_name',
  outputFile: 'signed-app.apk'
};

// Check if files exist
if (!fs.existsSync(config.apkFile)) {
  console.error(`❌ APK file not found: ${config.apkFile}`);
  process.exit(1);
}

if (!fs.existsSync(config.keystoreFile)) {
  console.error(`❌ Keystore file not found: ${config.keystoreFile}`);
  process.exit(1);
}

console.log('📱 Signing APK...');

// Run jarsigner
const cmd = `jarsigner -verbose \
  -sigalg SHA1withRSA \
  -digestalg SHA1 \
  -keystore "${config.keystoreFile}" \
  -storepass "${config.keystorePass}" \
  -signedjar "${config.outputFile}" \
  "${config.apkFile}" \
  "${config.keyAlias}"`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Signing failed:', error.message);
    return;
  }
  console.log('✅ APK signed successfully!');
  console.log(`📁 Output: ${config.outputFile}`);
  
  // Verify
  exec(`jarsigner -verify "${config.outputFile}"`, (err, out) => {
    console.log('🔍 Verification:', out.includes('jar verified') ? '✅ PASSED' : '❌ FAILED');
  });
});
