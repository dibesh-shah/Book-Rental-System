import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const  author = {
    fetchAuthor:{
        controllerName:`lib/authors/all-authors`,
        queryKeyName: `FETCH_AUTHOR`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
        
    },

    addAuthor: {
        controllerName: `lib/authors/add-author`,
        queryKeyName: `ADD_AUTHOR`,
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.AUTH
    },

    editAuthor: {
        controllerName: `lib/authors/update-author`,
        queryKeyName: `EDIT_AUTHOR`,
        requestMethod: RequestMethodEnum.PUT,
        requestAuthType: RequestAuthType.AUTH
    },
    
    fetchAuthorById: {
        controllerName: `lib/authors/find-by-id`,
        queryKeyName: `FETCH_AUTHOR_BY_ID`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
    },

    deleteAuthor: {
        controllerName: `lib/authors/delete-author`,
        queryKeyName: `DELETE_AUTHOR`,
        requestMethod: RequestMethodEnum.DELETE,
        requestAuthType: RequestAuthType.AUTH
    },

    downloadAuthor:{
        controllerName: `lib/authors/download-author`,
        queryKeyName: `DOWNLOAD_AUTHOR`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
    },

    uploadAuthor:{
        controllerName: `lib/authors/export-to-db`,
        queryKeyName: `UPLOAD_AUTHOR`,
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.AUTH
    }
}

export default author;
