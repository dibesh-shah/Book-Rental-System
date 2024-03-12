import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const  book = {
    fetchBook:{
        controllerName:`lib/books/get-all-books`,
        queryKeyName: `FETCH_BOOK`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
        
    },

    addBook: {
        controllerName: `lib/books/add-book`,
        queryKeyName: `ADD_BOOK`,
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.AUTH
    },

    editBook: {
        controllerName: `lib/books/update-book`,
        queryKeyName: `EDIT_BOOK`,
        requestMethod: RequestMethodEnum.PUT,
        requestAuthType: RequestAuthType.AUTH
    },
    
    fetchBookById: {
        controllerName: `lib/books/get-by-id`,
        queryKeyName: `FETCH_BOOK_BY_ID`,
        requestMethod: RequestMethodEnum.GET,
        requestAuthType: RequestAuthType.AUTH
    },

    deleteBook: {
        controllerName: `lib/books/delete-book`,
        queryKeyName: `DELETE_BOOK`,
        requestMethod: RequestMethodEnum.DELETE,
        requestAuthType: RequestAuthType.AUTH
    },

    // downloadBook:{
    //     controllerName: `book/download-excel-data`,
    //     queryKeyName: `DOWNLOAD_BOOK`,
    //     requestMethod: RequestMethodEnum.GET,
    //     requestAuthType: RequestAuthType.AUTH
    // },

}

export default book;
