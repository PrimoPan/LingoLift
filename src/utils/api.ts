import useStore from '../store/store';
import {
  GatewayOperation,
  invokeEncryptedOperation,
  unwrapGatewayPayload,
  type GatewayOperationValue,
} from '../grpc/gateway';
import type { AesCipherPayload } from '../security/aes';

type AiImageResponse = {
  imgurl?: string;
  data?: {
    imgurl?: string;
  } | string;
  answer?: string;
};

type CipherPromptEnvelope = {
  mode: 'cipher-only';
  promptId?: string;
  templateCipher: AesCipherPayload;
  varsCipher?: AesCipherPayload | null;
};

const toError = (error: unknown, fallbackMessage: string): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error((error as { message?: string } | null)?.message || fallbackMessage);
};

const isAesCipherPayload = (value: unknown): value is AesCipherPayload => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const payload = value as Record<string, unknown>;
  return (
    payload.alg === 'AES-256-GCM' &&
    typeof payload.keyId === 'string' &&
    typeof payload.ivB64 === 'string' &&
    typeof payload.tagB64 === 'string' &&
    typeof payload.ciphertextB64 === 'string' &&
    typeof payload.ts === 'number'
  );
};

const isCipherPromptEnvelope = (value: unknown): value is CipherPromptEnvelope => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const payload = value as Record<string, unknown>;
  if (payload.mode !== 'cipher-only' || !isAesCipherPayload(payload.templateCipher)) {
    return false;
  }
  if (payload.varsCipher === undefined || payload.varsCipher === null) {
    return true;
  }
  return isAesCipherPayload(payload.varsCipher);
};

const toCipherString = (input: unknown): string => {
  if (input === null || input === undefined) {
    return '';
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) {
      return '';
    }
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (isAesCipherPayload(parsed) || isCipherPromptEnvelope(parsed)) {
        return trimmed;
      }
    } catch {
      // fall-through to hard error below
    }
    throw new Error('Prompt must be encrypted JSON payload (cipher-only envelope).');
  }

  if (isAesCipherPayload(input) || isCipherPromptEnvelope(input)) {
    return JSON.stringify(input);
  }

  throw new Error('Prompt must be encrypted JSON payload (cipher-only envelope).');
};

const unwrapAiResponse = (payload: unknown): unknown => {
  if (!payload) {
    return payload;
  }
  if (typeof payload === 'string') {
    return payload;
  }

  const aiPayload = payload as AiImageResponse;
  if (typeof aiPayload.data === 'string') {
    return aiPayload.data;
  }
  if (typeof aiPayload.answer === 'string') {
    return aiPayload.answer;
  }
  return payload;
};

const readRuntimeUid = (): string => {
  const { username } = useStore.getState();
  return username?.trim() || 'anonymous';
};

const invokeAiOperation = async (
  operation: GatewayOperationValue,
  payload: Record<string, unknown>
): Promise<unknown> => {
  const token = useStore.getState().token || '';
  const gatewayResp = await invokeEncryptedOperation(operation, payload, token);
  return unwrapGatewayPayload(gatewayResp);
};

export const gptQuery = async (rawQuestion: unknown): Promise<unknown> => {
  const qusCipher = toCipherString(rawQuestion);
  if (!qusCipher) {
    throw new Error('问题不能为空');
  }

  try {
    const payload = await invokeAiOperation(GatewayOperation.GPT_QUERY, {
      uid: readRuntimeUid(),
      newtalk: 1,
      qus_cipher: qusCipher,
      prompt_mode: 'cipher-only',
    });

    const data = unwrapAiResponse(payload);
    if (!data) {
      throw new Error('接口未返回回答');
    }
    return data;
  } catch (error) {
    throw toError(error, '请求 GPT 失败');
  }
};

export const generateImage = async (description: unknown): Promise<string> => {
  const descCipher = toCipherString(description);
  if (!descCipher) {
    throw new Error('图片描述不能为空');
  }

  const { currentChildren } = useStore.getState();
  const imageStyle = currentChildren?.imageStyle;
  const style = imageStyle === 'realistic' ? 'xieshi' : 'ertonghuiben';

  try {
    const payload = await invokeAiOperation(GatewayOperation.GENERATE_IMAGE, {
      uid: readRuntimeUid(),
      style,
      picreq_cipher: descCipher,
      prompt_mode: 'cipher-only',
    });

    if (typeof payload === 'string') {
      return payload;
    }

    const objectPayload = payload as AiImageResponse;
    if (typeof objectPayload.imgurl === 'string') {
      return objectPayload.imgurl;
    }
    if (objectPayload.data && typeof objectPayload.data !== 'string' && objectPayload.data.imgurl) {
      return objectPayload.data.imgurl;
    }
    if (typeof objectPayload.data === 'string') {
      return objectPayload.data;
    }

    throw new Error('接口未返回有效的图片 URL');
  } catch (error) {
    throw toError(error, '生成图片失败');
  }
};
