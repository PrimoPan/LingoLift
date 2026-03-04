import 'react-native-get-random-values';
import { gcm } from '@noble/ciphers/aes';
import { utf8ToBytes } from '@noble/ciphers/utils';
import { Buffer } from 'buffer';

export type AesCipherPayload = {
  alg: 'AES-256-GCM';
  keyId: string;
  ivB64: string;
  tagB64: string;
  ciphertextB64: string;
  ts: number;
};

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

type CryptoGlobal = typeof global & {
  btoa?: (data: string) => string;
  atob?: (data: string) => string;
  crypto?: {
    getRandomValues: (array: Uint8Array) => Uint8Array;
  };
};

const runtime = global as CryptoGlobal;

const toBase64 = (bytes: Uint8Array): string => {
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  if (runtime.btoa) {
    return runtime.btoa(binary);
  }
  return Buffer.from(binary, 'binary').toString('base64');
};

const fromBase64 = (base64: string): Uint8Array => {
  if (runtime.atob) {
    const binary = runtime.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
};

const randomBytes = (length: number): Uint8Array => {
  if (!runtime.crypto?.getRandomValues) {
    throw new Error('crypto.getRandomValues is not available');
  }
  const bytes = new Uint8Array(length);
  runtime.crypto.getRandomValues(bytes);
  return bytes;
};

const normalizeKey = (key: Uint8Array | string): Uint8Array => {
  if (key instanceof Uint8Array) {
    if (key.length !== 32) {
      throw new Error('AES-256 key must be exactly 32 bytes');
    }
    return key;
  }

  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('AES-256 key must be a base64 string');
  }

  const decoded = fromBase64(key.trim());
  if (decoded.length !== 32) {
    throw new Error('AES-256 key must decode to 32 bytes');
  }
  return decoded;
};

export const encryptTextToAesPayload = (
  text: string,
  key: Uint8Array | string,
  keyId = 'key-v1'
): AesCipherPayload => {
  const normalizedKey = normalizeKey(key);
  const iv = randomBytes(IV_LENGTH);
  const cipher = gcm(normalizedKey, iv);

  const sealed = cipher.encrypt(utf8ToBytes(String(text)));
  const ciphertext = sealed.slice(0, -TAG_LENGTH);
  const tag = sealed.slice(-TAG_LENGTH);

  return {
    alg: 'AES-256-GCM',
    keyId,
    ivB64: toBase64(iv),
    tagB64: toBase64(tag),
    ciphertextB64: toBase64(ciphertext),
    ts: Date.now(),
  };
};

export const encryptJsonToAesPayload = (
  obj: unknown,
  key: Uint8Array | string,
  keyId = 'key-v1'
): AesCipherPayload => encryptTextToAesPayload(JSON.stringify(obj), key, keyId);
