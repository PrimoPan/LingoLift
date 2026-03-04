import useStore from '../store/store';
import {
  GatewayOperation,
  invokeEncryptedOperation,
  unwrapGatewayPayload,
} from '../grpc/gateway';

const toError = (error, fallbackMessage) => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(error?.message || String(error || fallbackMessage));
};

const toCipherString = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  if (input === null || input === undefined) {
    return '';
  }
  return JSON.stringify(input);
};

const unwrapAiResponse = (payload) => {
  if (!payload) {
    return payload;
  }
  if (typeof payload === 'string') {
    return payload;
  }
  if (typeof payload?.data === 'string') {
    return payload.data;
  }
  if (typeof payload?.answer === 'string') {
    return payload.answer;
  }
  return payload;
};

const invokeAiOperation = async (operation, payload) => {
  const token = useStore.getState().token || '';
  const gatewayResp = await invokeEncryptedOperation(operation, payload, token);
  return unwrapGatewayPayload(gatewayResp);
};

export const gptQuery = async (rawQuestion) => {
  const qusCipher = toCipherString(rawQuestion);
  if (!qusCipher) {
    throw new Error('问题不能为空');
  }

  try {
    const payload = await invokeAiOperation(GatewayOperation.GPT_QUERY, {
      uid: 'abcd',
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

export const generateImage = async (description) => {
  const descCipher = toCipherString(description);
  if (!descCipher) {
    throw new Error('图片描述不能为空');
  }

  const { currentChildren } = useStore.getState();
  const imageStyle = currentChildren?.imageStyle;
  const style = imageStyle === 'realistic' ? 'xieshi' : 'ertonghuiben';

  try {
    const payload = await invokeAiOperation(GatewayOperation.GENERATE_IMAGE, {
      uid: 'a81s',
      style,
      picreq_cipher: descCipher,
      prompt_mode: 'cipher-only',
    });

    if (typeof payload === 'string') {
      return payload;
    }
    if (payload?.imgurl) {
      return payload.imgurl;
    }
    if (payload?.data?.imgurl) {
      return payload.data.imgurl;
    }
    if (payload?.data && typeof payload.data === 'string') {
      return payload.data;
    }
    throw new Error('接口未返回有效的图片 URL');
  } catch (error) {
    throw toError(error, '生成图片失败');
  }
};
