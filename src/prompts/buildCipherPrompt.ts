import promptCatalog from './promptCatalog.enc';
import { encryptJsonToAesPayload, encryptTextToAesPayload } from '../security/aes';
import { getPromptAesKey, getPromptKeyId } from '../security/keys';
import type { PromptId } from './ids';

export const buildCipherPrompt = (
  promptId: PromptId,
  vars: Record<string, unknown> = {}
): string => {
  const templateCipher = promptCatalog[promptId];
  if (!templateCipher) {
    throw new Error(`Encrypted prompt template not found: ${promptId}`);
  }

  const varsCipher = encryptJsonToAesPayload(vars, getPromptAesKey(), getPromptKeyId());

  return JSON.stringify({
    mode: 'cipher-only',
    promptId,
    templateCipher,
    varsCipher,
  });
};

export const buildAdhocCipherPrompt = (
  plaintext: string,
  promptId = 'ADHOC_PROMPT'
): string => {
  const text = plaintext.trim();
  if (!text) {
    throw new Error('Plaintext prompt cannot be empty');
  }

  const key = getPromptAesKey();
  const keyId = getPromptKeyId();

  return JSON.stringify({
    mode: 'cipher-only',
    promptId,
    templateCipher: encryptTextToAesPayload(text, key, keyId),
    varsCipher: encryptJsonToAesPayload({}, key, keyId),
  });
};
