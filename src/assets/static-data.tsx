// Author Data

interface AuthorDataType{
    key : string ;
    name : string ;
    email : string ;
    mobile_number : string ;
}

export const AuthorData : AuthorDataType[] = [
    {
        key : '1' ,
        name : 'Ram Dhakal' ,
        email : 'hello@gmail.com' ,
        mobile_number : '9841254685' ,
    },
    
    {
        key : '2' ,
        name : 'Bibek Kandel' ,
        email : 'bibek@gmail.com' ,
        mobile_number : '9841278685' ,
    },

    {
        key : '3' ,
        name : 'Sita Sapkota' ,
        email : 'sita@gmail.com' ,
        mobile_number : '9841254665' ,
    },

];


// category Data

interface CategoryDataType {
    key: string;
    name: string;
    description: string;
  }
  
  export const CategoryData: CategoryDataType[] = [
    {
      key: '1',
      name: 'Science and Fiction',
      description: 'Science Fiction',
    },
    {
      key: '2',
      name: 'Personal Development',
      description: 'Personal Development',
    },
    {
      key: '3',
      name: 'Health',
      description: 'Health',
    },
  ];
  
//Member Data

  interface MemberDataType {
    key: string;
    name: string;
    email: string;
    mobile_no: string;
    address: string;
  
  }
  
  export const MemberData: MemberDataType[] = [
    {
      key: '1',
      name: 'Bikash',
      email: 'bikash@gmail.com',
      mobile_no: '9810314568',
      address: 'Baniyatar, Gongabu',
    },
    {
      key: '2',
      name: 'Shyam',
      email: 'shyam@gmail.com',
      mobile_no: '9813555455',
      address: 'Dhapasi, Tokha',
    },
    {
      key: '3',
      name: 'Nabin',
      email: 'nabin@gmail.com',
      mobile_no: '9813689437',
      address: 'Greenland, Tokha',
    },
  ];
  
  // Book Data

  interface BookDataType {
    key: string;
    name: string;
    isbn: string;
  }
  
  export const BookData: BookDataType[] = [
    {
      key: '1',
      name: 'Neuromancer',
      isbn: '9780547928227',
    },
    {
      key: '2',
      name: 'The 7 Habits of Highly Effective People',
      isbn: '9780345391803',
    },
    {
      key: '3',
      name: 'Being Mortal: Medicine and What Matters in the End',
      isbn: '9780747532699',
    },
  ];
  
  //Rent Data

  interface RentDataType {
    key: string;
    name: string;
    code: string;
  }
  
  export const RentData: RentDataType[] = [
    {
      key: '1',
      name: 'Neuromancer',
      code: '968E2',
    },
    {
      key: '2',
      name: 'The 7 Habits of Highly Effective People',
      code: '169C9',
    },
    {
      key: '3',
      name: 'Being Mortal: Medicine and What Matters in the End',
      code: '56PL6',
    },
  ];
  
  // Return Data
  
  interface ReturnDataType {
    key: string;
    name: string;
    code: string;
  }
  
  export const ReturnData: ReturnDataType[] = [
    {
      key: '1',
      name: 'The Lords',
      code: 'CC11SS',
    },
    {
      key: '2',
      name: 'Conjuring',
      code: 'PP99RR',
    },
    {
      key: '3',
      name: 'Hunger games',
      code: 'LL55TT',
    },
  ];
  