import { IApiDetails } from "../../schema/http.schema";

export const sanitizeController = (
  apiDetails: IApiDetails,
  pathVariables?: { [key: string]: string | boolean | number }
) => {
  return pathVariables && Object.keys(pathVariables).length
    ? {
        ...apiDetails,
        controllerName: Object.entries(pathVariables).reduce(
          (acc, [key, value]) =>
            (acc = acc.replace(`{${key}}`, value?.toString())),
          apiDetails.controllerName
        ),
      }
    : apiDetails;
};
