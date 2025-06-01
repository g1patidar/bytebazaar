import { google, drive_v3 } from 'googleapis';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const credentials = require('./service-account.json');

const oauth2Client = new OAuth2Client(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

const KEYFILE_PATH = path.join(__dirname, './service-account.json');

/**
 * Returns an authenticated Google Drive service using a Service Account.
 */
export async function getDriveService(): Promise<drive_v3.Drive> {
  console.log(KEYFILE_PATH);
  const auth = new GoogleAuth({
    keyFile: KEYFILE_PATH,
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  const authClient = await auth.getClient();
  return google.drive({ version: 'v3', auth: authClient as any });
}

/**
 * Uploads a file to Google Drive
 * @param filePath - Path to the file to upload
 * @param mimeType - MIME type of the file
 * @returns Object containing file id and webViewLink
 */
export async function uploadToDrive(filePath: string, mimeType: string): Promise<{ fileId: string; webViewLink: string }> {
  const drive = await getDriveService(); // 🔁 updated

  const fileMetadata = {
    name: path.basename(filePath),
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    if (response.data.id && response.data.webViewLink) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink,
      };
    }
    throw new Error('File upload failed');
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}


/**
 * Downloads a Google Drive file to the local file system.
 * @param fileId - The file ID on Google Drive.
 * @param destinationPath - Local path to save the file.
 */
export async function downloadDriveFile(fileId: string, destinationPath: string): Promise<void> {
  const drive = await getDriveService(); // 🔁 updated

  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  const dest = fs.createWriteStream(destinationPath);

  return new Promise((resolve, reject) => {
    response.data
      .on('end', () => {
        console.log('✅ File downloaded to:', destinationPath);
        resolve();
      })
      .on('error', (err: any) => {
        console.error('❌ Download error:', err);
        reject(err);
      })
      .pipe(dest);
  });
}

/**
 * Deletes a file from Google Drive
 * @param fileId - The ID of the file to delete
 */
export async function deleteFromDrive(fileId: string): Promise<void> {
  const drive = await getDriveService();
  
  try {
    await drive.files.delete({ fileId });
    console.log('✅ File deleted successfully:', fileId);
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw error;
  }
}
