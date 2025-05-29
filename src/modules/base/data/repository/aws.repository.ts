import AWS from 'aws-sdk';
import { S3Param } from '@/modules/base/enums/s3.type';
import dotenv from 'dotenv';
dotenv.config();

const bucketName = process.env.AWS_S3_BUCKET_NAME as string;
const expiresAt = 600; // seconds
const cdnExpiresAt = 7; // days

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  useAccelerateEndpoint: true,
  endpoint: `${bucketName}.s3-accelerate.amazonaws.com`,
  region: process.env.AWS_REGION,
  credentials: new AWS.Credentials(
    process.env.AWS_ACCESS_KEY_ID ?? '',
    process.env.AWS_ACCESS_SECRET ?? ''
  ),
});

export async function createFileWithString(
  content: string,
  key: string,
  isPublic = false
) {
  const buff = Buffer.from(content, 'utf8');
  const newObject = await s3
    .putObject({
      Bucket: bucketName,
      Key: key,
      Body: buff,
      ContentEncoding: 'base64',
      ContentType: 'application/octet-stream',
      ACL: isPublic ? 'public-read' : '',
    })
    .promise();
  return newObject;
}

export async function createFileWithBuffer(
  stream: Buffer,
  key: string,
  isPublic = false
) {
  const newObject = await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: stream,
      ACL: isPublic ? 'public-read' : '',
    })
    .promise();

  return newObject;
}

export async function getFileUrl(key: string) {
  const m3u8Url = await s3.getSignedUrlPromise('getObject', {
    Bucket: bucketName,
    Expires: expiresAt,
    Key: key,
  });
  return m3u8Url;
}

export async function getFileContent(key: string) {
  const data = await s3
    .getObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
  return data;
}

export async function getFileContentAsBuffer(
  key: string
): Promise<Buffer> {
  const data = await s3
    .getObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
  return data.Body as Buffer;
}

export async function getSignedUrlPromise(
  action: string,
  params: any
): Promise<string> {
  const url = await s3.getSignedUrlPromise(action, params);
  return url;
}

export const uploadUrlByKey = async (
  type: string, // TODO change to enum
  base: string,
  key: string,
  signed = true
): Promise<string | Error> => {
  try {
    const params = {
      Bucket: bucketName,
      ContentType: 'application/octet-stream',
      Expires: expiresAt,
      Key: `${base}/${key}.${type}`,
    } as S3Param;

    if (signed) {
      params.ACL = 'private';
    } else {
      params.ACL = 'public-read';
    }

    const url = await getSignedUrlPromise('putObject', params);
    return url;
  } catch (e) {
    return e as Error;
  }
};

export const fileExists = async (key: string): Promise<boolean> => {
  try {
    console.log(bucketName, key);

    const dta = await s3
      .headObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();

    if (
      dta.$response.error &&
      dta.$response.error.code == 'NotFound'
    ) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
};

export { bucketName, expiresAt, cdnExpiresAt };
