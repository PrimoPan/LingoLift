const DEFAULT_PROMPT_KEY_ID = 'prompt-key-v1';
const DEFAULT_API_KEY_ID = 'api-key-v1';

const readEnv = (...keys: string[]): string => {
  for (const key of keys) {
    const value = process?.env?.[key];
    if (value) {
      return value;
    }
  }
  return '';
};

const readKey = (...keys: string[]): string => {
  const value = readEnv(...keys);
  if (value) {
    return value;
  }
  throw new Error(`Missing AES key env: ${keys.join(' / ')}`);
};

export const getPromptAesKey = (): string =>
  readKey('PROMPT_AES_KEY_B64', 'EXPO_PUBLIC_PROMPT_AES_KEY_B64');

export const getApiAesKey = (): string =>
  readKey('API_AES_KEY_B64', 'EXPO_PUBLIC_API_AES_KEY_B64');

export const getPromptKeyId = (): string =>
  readEnv('PROMPT_AES_KEY_ID', 'EXPO_PUBLIC_PROMPT_AES_KEY_ID') || DEFAULT_PROMPT_KEY_ID;

export const getApiKeyId = (): string =>
  readEnv('API_AES_KEY_ID', 'EXPO_PUBLIC_API_AES_KEY_ID') ||
  DEFAULT_API_KEY_ID;
