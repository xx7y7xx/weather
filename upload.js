const fs = require('fs');
const {google} = require('googleapis');
const keyFile = 'credentials.json';

const drive = google.drive({
  version: 'v3',
  auth: new google.auth.JWT({
    keyFile: keyFile,
    scopes: ['https://www.googleapis.com/auth/drive'],
  }),
});

async function uploadFile(filePath) {
  const fileName = filePath.split('/').pop();
  const folderId = process.env.FOLDERID;

  try {
    // Check if the file already exists in the folder
    let existingFileId;
    const searchResponse = await drive.files.list({
      q: `mimeType='image/png' and trashed = false and '${folderId}' in parents and name='${fileName}'`,
      fields: 'nextPageToken, files(id, name)',
    });

    if (searchResponse.data.files.length > 0) {
      existingFileId = searchResponse.data.files[0].id;
    }

    // Upload or replace the file
    const fileMetadata = {
      'name': fileName,
      'parents': [folderId],
    };
    const media = {
      mimeType: 'image/png',
      body: fs.createReadStream(filePath),
    };

    if (existingFileId) {
      console.log(`[upload.js] File ${fileName} already exists, replacing it.`);
      const response = await drive.files.update({
        fileId: existingFileId,
        requestBody: fileMetadata,
        media,
        fields: 'id',
      });
      console.log(`[upload.js] File ID: ${response.data.id}, File: ${filePath} - Replaced`);
    } else {
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id',
      });
      console.log(`[upload.js] File ID: ${response.data.id}, File: ${filePath} - Uploaded`);
    }
  } catch (err) {
    console.error(`[upload.js] Error processing ${filePath}:`, err, fileMetadata);
  }
}

async function uploadFiles() {
  const files = fs.readdirSync('.').filter((file) => file.startsWith('radar_frame_timestamp_'));
  for (const file of files) {
    await uploadFile(file);
  }
}

uploadFiles();