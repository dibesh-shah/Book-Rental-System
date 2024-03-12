import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const password = {
  generateOTP: {
    queryKeyName: "GENERATE_OTP",
    controllerName: "reset-password/generate-Otp",
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.NOAUTH,
  },

  resetPassword: {
    queryKeyName: "RESET_PASSWORD",
    controllerName: "reset-password/reset",
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.NOAUTH,
  },

};


export default password;
