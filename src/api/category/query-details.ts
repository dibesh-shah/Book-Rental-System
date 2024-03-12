import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const  category = {
    fetchCategory:{
        controllerName:`lib/category/get-all-category`,
        queryKeyName: `FETCH_CATEGORY`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
        
    },

    addCategory: {
        controllerName: `lib/category/add-category`,
        queryKeyName: `ADD_CATEGORY`,
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.AUTH
    },

    editCategory: {
        controllerName: `lib/category/update-category`,
        queryKeyName: `EDIT_CATEGORY`,
        requestMethod: RequestMethodEnum.PUT,
        requestAuthType: RequestAuthType.AUTH
    },

    fetchCategoryById: {
        controllerName: `lib/category/get-by-id`,
        queryKeyName: `FETCH_CATEGORY_BY_ID`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
    },


    deleteCategory: {
        controllerName: `lib/category/delete-category`,
        queryKeyName: `DELETE_CATEGORY`,
        requestMethod: RequestMethodEnum.DELETE,
        requestAuthType: RequestAuthType.AUTH
    },

    downloadCategory:{
        controllerName: `lib/category/download-category`,
        queryKeyName: `DOWNLOAD_CATEGORY`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
    },

    uploadCategory:{
        controllerName: `lib/category/export-to-db-category`,
        queryKeyName: `UPLOAD_CATEGORY`,
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.AUTH
    }
}

export default category;
