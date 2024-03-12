import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const user = {
  fetchUser: {
    controllerName: `admin/user/get-all-users`,
    queryKeyName: `FETCG_USER`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  addUser: {
    controllerName: `admin/user/add-user`,
    queryKeyName: `ADD_USER`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  reactivateUser: {
    controllerName: `admin/user/reactivate`,
    queryKeyName: `REACTIVATE_USER`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  deactivateUser: {
    controllerName: `admin/user/deactivate`,
    queryKeyName: `DEACTIVATE_USER`,
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  resetUser: {
    controllerName: `admin/user/reset`,
    queryKeyName: `RESET_USER`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },
};

export default user;
