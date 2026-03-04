const readEnv = (...keys: string[]): string => {
  for (const key of keys) {
    const value = process?.env?.[key];
    if (value) {
      return value;
    }
  }
  return '';
};

export const GRPC_BASE_URL: string =
  readEnv('EXPO_PUBLIC_GRPC_BASE_URL', 'GRPC_BASE_URL') ||
  'http://43.138.212.17:2124';

export const GRPC_GATEWAY_PATH: string =
  readEnv('EXPO_PUBLIC_GRPC_GATEWAY_PATH', 'GRPC_GATEWAY_PATH') ||
  '/lingolift.v1.GatewayService/Invoke';
