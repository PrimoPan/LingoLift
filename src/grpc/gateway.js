import { invokeGateway } from './client';
import { encryptJsonToAesPayload } from '../security/aes';
import { getApiAesKey, getApiKeyId } from '../security/keys';

export const GatewayOperation = {
  LOGIN: 'LOGIN',
  CHANGE_CHILDREN_INFO: 'CHANGE_CHILDREN_INFO',
  CREATE_LEARNING: 'CREATE_LEARNING',
  GET_CHILDREN_LIST: 'GET_CHILDREN_LIST',
  GET_CHILD_DETAILS: 'GET_CHILD_DETAILS',
  GET_LEARNING_HISTORY_FOR_CHILD: 'GET_LEARNING_HISTORY_FOR_CHILD',
  GPT_QUERY: 'GPT_QUERY',
  GENERATE_IMAGE: 'GENERATE_IMAGE',
};

const tryParseJson = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const unwrapGatewayPayload = (gatewayResponse) => {
  if (!gatewayResponse || typeof gatewayResponse !== 'object') {
    return gatewayResponse;
  }

  const candidates = [
    gatewayResponse.payload_json,
    gatewayResponse.payloadJson,
    gatewayResponse.data_json,
    gatewayResponse.dataJson,
    gatewayResponse.result_json,
    gatewayResponse.resultJson,
    gatewayResponse.payload,
    gatewayResponse.data,
    gatewayResponse.result,
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && candidate !== '') {
      return tryParseJson(candidate);
    }
  }

  return gatewayResponse;
};

export const invokeEncryptedOperation = async (operation, plainPayload, token = '') => {
  const encryptedPayload = encryptJsonToAesPayload(
    plainPayload,
    getApiAesKey(),
    getApiKeyId()
  );

  return invokeGateway({
    operation,
    payloadJson: JSON.stringify(encryptedPayload),
    token,
  });
};
