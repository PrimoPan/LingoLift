import { createClient, type CallOptions } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { GRPC_BASE_URL } from '../config/network';
import { GatewayService } from '../gen/proto/lingolift/v1/gateway_connect';

export type GatewayInvokeInput = {
  operation: string;
  payloadJson: string;
  token?: string;
};

export type GatewayRawResponse = Record<string, unknown>;
const transport = createConnectTransport({
  baseUrl: GRPC_BASE_URL,
  useBinaryFormat: false,
});
const gatewayClient = createClient(GatewayService, transport);

export const invokeGateway = async ({
  operation,
  payloadJson,
  token,
}: GatewayInvokeInput): Promise<GatewayRawResponse> => {
  const headers = new Headers();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const callOptions: CallOptions = { headers };
  const response = await gatewayClient.invoke(
    {
      operation,
      payloadJson,
    },
    callOptions
  );

  return {
    success: response.success,
    message: response.message,
    payload_json: response.payloadJson,
    payloadJson: response.payloadJson,
    data: response.payloadJson,
  };
};
