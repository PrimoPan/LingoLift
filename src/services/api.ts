import useStore from '../store/store';
import {
  GatewayOperation,
  invokeEncryptedOperation,
  unwrapGatewayPayload,
  type GatewayOperationValue,
} from '../grpc/gateway';

type GatewaySuccessEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  token?: string;
};

type ChildNamePayload = {
  name: string;
};

type LoginPayload = {
  username: string;
  password: string;
};

const toError = (error: unknown, fallbackMessage: string): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error((error as { message?: string } | null)?.message || fallbackMessage);
};

const ensureAuthToken = (): string => {
  const token = useStore.getState().token;
  if (!token) {
    throw new Error('未登录，缺少认证令牌');
  }
  return token;
};

const invokeBusinessOperation = async <T = unknown>(
  operation: GatewayOperationValue,
  payload: unknown,
  options: { requireAuth?: boolean } = {}
): Promise<T> => {
  const token = options.requireAuth === false ? '' : ensureAuthToken();
  const gatewayResp = await invokeEncryptedOperation(operation, payload, token);
  return unwrapGatewayPayload<T>(gatewayResp);
};

export const loginTeacher = async (
  username: string,
  password: string
): Promise<GatewaySuccessEnvelope<unknown>> => {
  try {
    const data = await invokeBusinessOperation<GatewaySuccessEnvelope<unknown>>(
      GatewayOperation.LOGIN,
      { username, password } satisfies LoginPayload,
      { requireAuth: false }
    );
    return data;
  } catch (error) {
    throw toError(error, '登录失败');
  }
};

export const changeChildrenInfo = async <T = unknown>(
  childData: Record<string, unknown>
): Promise<GatewaySuccessEnvelope<T>> => {
  try {
    return await invokeBusinessOperation<GatewaySuccessEnvelope<T>>(
      GatewayOperation.CHANGE_CHILDREN_INFO,
      childData
    );
  } catch (error) {
    throw toError(error, '提交儿童信息失败');
  }
};

export const createLearning = async <T = unknown>(
  Goals: unknown,
  childName: string
): Promise<GatewaySuccessEnvelope<T>> => {
  try {
    return await invokeBusinessOperation<GatewaySuccessEnvelope<T>>(
      GatewayOperation.CREATE_LEARNING,
      { Goals, childName }
    );
  } catch (error) {
    throw toError(error, '提交学习记录失败');
  }
};

export const getChildrenList = async <T = unknown>(): Promise<GatewaySuccessEnvelope<T>> => {
  try {
    return await invokeBusinessOperation<GatewaySuccessEnvelope<T>>(
      GatewayOperation.GET_CHILDREN_LIST,
      {}
    );
  } catch (error) {
    throw toError(error, '获取儿童列表失败');
  }
};

export const getChildDetails = async <T = unknown>(
  childName: string
): Promise<GatewaySuccessEnvelope<T>> => {
  try {
    return await invokeBusinessOperation<GatewaySuccessEnvelope<T>>(
      GatewayOperation.GET_CHILD_DETAILS,
      { name: childName } satisfies ChildNamePayload
    );
  } catch (error) {
    throw toError(error, '获取儿童详情失败');
  }
};

export const getLearningHistoryForChild = async <T = unknown>(
  childName: string
): Promise<GatewaySuccessEnvelope<T>> => {
  try {
    return await invokeBusinessOperation<GatewaySuccessEnvelope<T>>(
      GatewayOperation.GET_LEARNING_HISTORY_FOR_CHILD,
      { name: childName } satisfies ChildNamePayload
    );
  } catch (error) {
    throw toError(error, '获取学习历史失败');
  }
};
