import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL!;

/**
 * Upload a file to S3 and return the CloudFront URL.
 * @param fileBuffer - File content as a Buffer.
 * @param fileName - Original file name (used for metadata).
 * @param folder - Folder path in the bucket (optional).
 * @returns CloudFront URL and file key.
 */
export const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  folder: string = ''
): Promise<{ cdnUrl: string; key: string }> => {
  const fileKey = `${folder ? `${folder}/` : ''}${fileName}`;
  const params: AWS.S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: 'application/octet-stream',
    ACL: 'public-read', // Ensure public-read for CloudFront access
  };

  try {
    await s3.upload(params).promise();
    const cdnUrl = `${CLOUDFRONT_URL}/${fileKey}`;
    return { cdnUrl, key: fileKey };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete a file from S3.
 * @param fileKey - Key of the file to delete.
 * @returns Success message.
 */
export const deleteFile = async (
  fileKey: string
): Promise<string> => {
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };

  try {
    await s3.deleteObject(params).promise();
    return `File with key ${fileKey} successfully deleted`;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Generate a pre-signed URL for temporary access to an object.
 * @param fileKey - Key of the file in S3.
 * @param expiresIn - URL expiration time in seconds (default: 3600).
 * @returns Pre-signed URL.
 */
export const generatePresignedUrl = async (
  fileKey: string,
  expiresIn: number = 3600
): Promise<string> => {
  const params: AWS.S3.GetObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', {
      ...params,
      Expires: expiresIn,
    });
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Failed to generate pre-signed URL');
  }
};
