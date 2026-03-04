import { GRPC_BASE_URL, GRPC_GATEWAY_PATH } from '../config/network';

const joinUrl = (base, path) => {
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const invokeGateway = async ({ operation, payloadJson, token }) => {
  const endpoint = joinUrl(GRPC_BASE_URL, GRPC_GATEWAY_PATH);
  const headers = {
    'Content-Type': 'application/json',
    'Connect-Protocol-Version': '1',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      operation,
      payload_json: payloadJson,
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`gRPC invoke failed (${response.status}): ${text}`);
  }

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`gRPC response is not valid JSON: ${text}`);
  }
};
