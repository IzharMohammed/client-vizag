import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

let cachedClient: S3Client | undefined;

export function isR2Configured() {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME,
  );
}

function r2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      "Cloudflare R2 is not configured. Set CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME.",
    );
  }

  cachedClient ??= new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { client: cachedClient, bucket };
}

export function isSafeObjectKey(key: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,255}$/.test(key);
}

export async function putImage(key: string, file: File) {
  const { client, bucket } = r2Config();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

export async function getImage(key: string) {
  const { client, bucket } = r2Config();
  const object = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  if (!object.Body) return null;
  return {
    bytes: await object.Body.transformToByteArray(),
    contentType: object.ContentType || "application/octet-stream",
    cacheControl: object.CacheControl,
    etag: object.ETag,
  };
}

export async function deleteImage(key: string | null | undefined) {
  if (!key || !isR2Configured()) return;
  const { client, bucket } = r2Config();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
