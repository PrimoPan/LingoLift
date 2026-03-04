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

const ensureAuthToken = () => {
  const token = useStore.getState().token;
  if (!token) {
    throw new Error('未登录，缺少认证令牌');
  }
  return token;
};

const invokeBusinessOperation = async (
  operation,
  payload,
  { requireAuth = true } = {}
) => {
  const token = requireAuth ? ensureAuthToken() : '';
  const gatewayResp = await invokeEncryptedOperation(operation, payload, token);
  return unwrapGatewayPayload(gatewayResp);
};

export const loginTeacher = async (username, password) => {
  try {
    const data = await invokeBusinessOperation(
      GatewayOperation.LOGIN,
      { username, password },
      { requireAuth: false }
    );
    return data;
  } catch (error) {
    throw toError(error, '登录失败');
  }
};

export const changeChildrenInfo = async (childData) => {
  try {
    const data = await invokeBusinessOperation(
      GatewayOperation.CHANGE_CHILDREN_INFO,
      childData
    );
    return data;
  } catch (error) {
    throw toError(error, '提交儿童信息失败');
  }
};

export const createLearning = async (Goals, childName) => {
  try {
    const data = await invokeBusinessOperation(GatewayOperation.CREATE_LEARNING, {
      Goals,
      childName,
    });
    return data;
  } catch (error) {
    throw toError(error, '提交学习记录失败');
  }
};

export const getChildrenList = async () => {
  try {
    const data = await invokeBusinessOperation(GatewayOperation.GET_CHILDREN_LIST, {});
    return data;
  } catch (error) {
    throw toError(error, '获取儿童列表失败');
  }
};

export const getChildDetails = async (childName) => {
  try {
    const data = await invokeBusinessOperation(GatewayOperation.GET_CHILD_DETAILS, {
      name: childName,
    });
    return data;
  } catch (error) {
    throw toError(error, '获取儿童详情失败');
  }
};

export const getLearningHistoryForChild = async (childName) => {
  try {
    const data = await invokeBusinessOperation(
      GatewayOperation.GET_LEARNING_HISTORY_FOR_CHILD,
      { name: childName }
    );
    return data;
  } catch (error) {
    throw toError(error, '获取学习历史失败');
  }
};
