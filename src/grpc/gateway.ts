import { invokeGateway, type GatewayRawResponse } from './client';
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
} as const;

export type GatewayOperationValue =
  (typeof GatewayOperation)[keyof typeof GatewayOperation];

const tryParseJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
};

export const unwrapGatewayPayload = <T = unknown>(gatewayResponse: unknown): T => {
  if (!gatewayResponse || typeof gatewayResponse !== 'object') {
    return gatewayResponse as T;
  }

  const response = gatewayResponse as Record<string, unknown>;
  const candidates: unknown[] = [
    response.payload_json,
    response.payloadJson,
    response.data_json,
    response.dataJson,
    response.result_json,
    response.resultJson,
    response.payload,
    response.data,
    response.result,
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && candidate !== '') {
      return tryParseJson(candidate) as T;
    }
  }

  return gatewayResponse as T;
};

export const invokeEncryptedOperation = async (
  operation: GatewayOperationValue,
  plainPayload: unknown,
  token = ''
): Promise<GatewayRawResponse> => {
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
