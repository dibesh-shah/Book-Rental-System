import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const  member = {
    fetchMember:{
        controllerName:`lib/members/all-members`,
        queryKeyName: `FETCH_MEMBER`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
        
    },

    addMember: {
        controllerName: `lib/members/add-member`,
        queryKeyName: `ADD_MEMBER`,
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.AUTH
    },

    editMember: {
        controllerName: `lib/members/update-members`,
        queryKeyName: `EDIT_MEMBER`,
        requestMethod: RequestMethodEnum.PUT,
        requestAuthType: RequestAuthType.AUTH
    },

    fetchMemberById: {
        controllerName: `lib/members/get-by-id`,
        queryKeyName: `FETCH_MEMBER_BY_ID`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
    },

    deleteMember: {
        controllerName: `lib/members/remove-member`,
        queryKeyName: `DELETE_MEMBER`,
        requestMethod: RequestMethodEnum.DELETE,
        requestAuthType: RequestAuthType.AUTH
    },

    downloadMember:{
        controllerName: `lib/members/download-members`,
        queryKeyName: `DOWNLOAD_MEMBER`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
    },

    uploadMember:{
        controllerName: `lib/members/export-to-db-members`,
        queryKeyName: `UPLOAD_MEMBER`,
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.AUTH
    }
}

export default member;
