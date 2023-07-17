const fs = require('fs');
const {google} = require('googleapis');
const keyFile = 'credentials.json';

console.log('google.auth', google.auth);

const drive = google.drive({
  version: 'v3',
  auth: new google.auth.JWT({
    keyFile: keyFile,
    scopes: ['https://www.googleapis.com/auth/drive'],
  }),
});

async function uploadFile(filePath) {
  const fileMetadata = {
    'name': filePath.split('/').pop(),
    'parents': [process.env.FOLDERID],
  };
  const media = {
    mimeType: 'image/png',
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });
    console.log(`File ID: ${response.data.id}, File: ${filePath} - Uploaded`);
  } catch (err) {
    console.error(`Error uploading ${filePath}:`, err);
  }
}

async function uploadFiles() {
  const files = fs.readdirSync('.').filter((file) => file.startsWith('radar_frame_timestamp_'));
  for (const file of files) {
    await uploadFile(file);
  }
}

uploadFiles();