import promptCatalog from './promptCatalog.enc';
import { encryptJsonToAesPayload } from '../security/aes';
import { getPromptAesKey, getPromptKeyId } from '../security/keys';

export const buildCipherPrompt = (promptId, vars = {}) => {
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
