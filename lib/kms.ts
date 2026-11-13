import { KeyManagementServiceClient } from '@google-cloud/kms';

let kmsClient: KeyManagementServiceClient | null = null;

function getKeyName(): string | null {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.KMS_LOCATION;
  const keyRing = process.env.KMS_KEY_RING;
  const keyName = process.env.KMS_KEY_NAME;

  if (!projectId || !location || !keyRing || !keyName) {
    return null;
  }

  if (!kmsClient) {
    kmsClient = new KeyManagementServiceClient();
  }

  return kmsClient.cryptoKeyPath(projectId, location, keyRing, keyName);
}

export async function encrypt(plaintext: string): Promise<string> {
  const keyName = getKeyName();
  if (!keyName || !kmsClient) {
    // Development / fallback encoding when KMS is not configured
    return Buffer.from(plaintext, 'utf8').toString('base64');
  }

  const [result] = await kmsClient.encrypt({
    name: keyName,
    plaintext: Buffer.from(plaintext, 'utf8'),
  });
  return Buffer.from(result.ciphertext as Uint8Array).toString('base64');
}

export async function decrypt(ciphertextBase64: string): Promise<string> {
  const keyName = getKeyName();
  if (!keyName || !kmsClient) {
    // Development / fallback decoding when KMS is not configured
    return Buffer.from(ciphertextBase64, 'base64').toString('utf8');
  }

  const [result] = await kmsClient.decrypt({
    name: keyName,
    ciphertext: Buffer.from(ciphertextBase64, 'base64'),
  });
  return Buffer.from(result.plaintext as Uint8Array).toString('utf8');
}
