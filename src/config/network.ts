const readEnv = (...keys: string[]): string => {
  for (const key of keys) {
    const value = process?.env?.[key];
    if (value) {
      return value;
    }
  }
  return '';
};

const readRequiredEnv = (...keys: string[]): string => {
  const value = readEnv(...keys).trim();
  if (!value) {
    throw new Error(`Missing required env: ${keys.join(' / ')}`);
  }
  return value;
};

const isLocalHost = (hostname: string): boolean =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '10.0.2.2';

const isInsecureHttpAllowed = (): boolean =>
  readEnv('ALLOW_INSECURE_GRPC', 'EXPO_PUBLIC_ALLOW_INSECURE_GRPC') === 'true';

const normalizeGrpcBaseUrl = (url: string): string => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid GRPC_BASE_URL: ${url}`);
  }

  if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname) && !isInsecureHttpAllowed()) {
    throw new Error('Insecure HTTP gRPC endpoint is blocked. Use HTTPS or set ALLOW_INSECURE_GRPC=true.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Unsupported gRPC protocol: ${parsed.protocol}`);
  }

  return parsed.toString().replace(/\/+$/, '');
};

export const GRPC_BASE_URL: string = normalizeGrpcBaseUrl(
  readRequiredEnv('GRPC_BASE_URL', 'EXPO_PUBLIC_GRPC_BASE_URL')
);
