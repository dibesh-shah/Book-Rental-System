import {
  Form,
  Input,
  Button,
  message,
  Select,
  Row,
  Col,
  DatePicker,
  Upload,
  InputNumber,
} from "antd";
import {
  BarcodeOutlined,
  BookOutlined,
  StarOutlined,
  UploadOutlined,
  FileTextOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import type { UploadProps } from "antd";

// import { AuthorData, CategoryData } from "../assets/static-data";
import { useAddBook, useEditBook } from "../api/book/queries";
import { useFetchAuthor } from "../api/author/queries";
import { useFetchCategory } from "../api/category/queries";
import dayjs from "dayjs";

interface BookFormProps {
  initialdata?: BookDataType | null | undefined;
  editMode: boolean;
  // initialData: Object | null;
  onSuccess: () => void;
  onUpdateBook: (data:any) => void;
}

interface BookDataType {
  id: string;
  name: string;
  rating: any;
  stock: any;
  publishedDate: any;
  file: any;
  isbn: any;
  pages: any;
  categoryId: any;
  authorId: any;
  photo:any;
}

const { Option } = Select;

const props: UploadProps = {
  
  beforeUpload: (file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const isAllowedType = allowedTypes.includes(file.type);

    if (!isAllowedType) {
      message.error(
        `${file.name} is not a valid image file (PNG, JPEG, JPG only)`
      );
      return Upload.LIST_IGNORE;
    }

    return false; 
  }
  // ,
  // onChange: (info) => {
  //   console.log(info.fileList);
  // },
};

const BookForm: React.FC<BookFormProps> = ({
  editMode,
  initialData,
  onSuccess,
  onUpdateBook
}) => {
  const [form] = Form.useForm();

  const { mutate: addBook, isLoading: isAddingBook } = useAddBook();
  const { mutate: editBook, isLoading: isEditingBook } = useEditBook();

  const { data: CategoryData, isLoading: categoryLoading,  } = useFetchCategory();
  const { data: AuthorData, isLoading: authorLoading, } = useFetchAuthor();

  let authorsArray =[];
  let categoryArray =[];

  if(initialData){
    const { authorName, categoryName } = initialData;
    authorsArray = authorName ? authorName.split(', ') : [];
    categoryArray = categoryName ? categoryName.split(', ') : [];
  }


  const onFinish = (values: any) => {
    console.log(values.file.file)
    let payload: any = {
      name: values.name,
      email: values.email,
      pages: values.pages,
      isbn: values.isbn,
      rating: values.rating,
      stock: values.stock,
      publishedDate: dayjs(values.publishedDate).format("YYYY-MM-DD"),
      categoryId: values.categoryId,
      authorId: values.authorId,
      photo: values.photo,
      file: values.file.file,
    };

    if (initialData) { 
      payload = { ...payload, id: initialData.id, file: undefined,  };

      editBook(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Edited Book ${values.name} Successfully`);
          onUpdateBook(payload)
          // onUpdateAuthor(payload);
          onReset();
        },
      });
    } else {
      addBook(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Added Book ${values.name} Successfully`);
          onReset();
        },
      });
    }

    console.log("Received values:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form for errors.");
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (initialData) {
      // form.setFieldsValue(initialData);
      if (initialData) {
        form.setFieldsValue({
  
          id:initialData.id,
        name: initialData.name,
        rating: initialData.rating,
        stock: initialData.stock,
         publishedDate: dayjs(initialData.publishedDate, 'YYYY/MM/DD'),
        // file: selectedBook.file.file,
        isbn: initialData.isbn,
        pages: initialData.pages,
        categoryId: initialData.categoryId,
        authorId: initialData.authorId,
        photo: initialData.photo,
        });
      }
    } 

    return () => {
      form.resetFields(); 
    };
  }, [form, initialData]);

  // const validateISBN = (rule, value, callback) => {
  //   const isValidISBN = /^\d{13}$/.test(value);

  //   if (!isValidISBN) {
  //     callback('ISBN must be a 13-digit number');
  //   } else {
  //     callback();
  //   }
  // };

  return (
    <Form
      form={form}
      name="bookForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{ span: 6, offset: 0 }}
      wrapperCol={{ span: 20 }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select a category" defaultValue={categoryArray}>
              {CategoryData?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Authors"
            name="authorId"
            rules={[{ required: true, message: "Please select author" }]}
          >
            <Select placeholder="Select author" mode="multiple" defaultValue={authorsArray} >
              {AuthorData?.map((author) => (
                <Option key={author.authorId} value={author.id}>
                  {author.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Pages"
            name="pages"
            rules={[{ required: true, message: "Please enter no. of pages!" }]}
          >
            <Input prefix={<FileTextOutlined />} placeholder="Book Pages" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[
              { required: true, message: "Please enter the book rating!" },
              {
                type: "number",
                min: 1,
                message: "Please enter a valid rating",
              },
            ]}
          >
            <InputNumber
              prefix={<StarOutlined />}
              placeholder="Book Rating"
              className="w-full"
              step={0.1}
              precision={1}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[
              { required: true, message: "Please enter stock quantity!" },
              {
                type: "number",
                min: 1,
                message: "Please enter a valid rating",
              },
            ]}
          >
            <InputNumber
              prefix={<StockOutlined />}
              placeholder="Book Stock"
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Published"
            name="publishedDate"
            rules={[
              {
                required: true,
                message: "Please enter the book published date!",
              },
            ]}
          >
            <DatePicker placeholder="Book Published Date" className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the book name!" }]}
          >
            <Input prefix={<BookOutlined />} placeholder="Book Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Isbn"
            name="isbn"
            rules={[
              { required: true, message: "Please enter the book's isbn" },
              // { validator: validateISBN, message: "ISBN must be a 13-digit number" },
            ]}
          >
            <Input prefix={<BarcodeOutlined />} placeholder="Author's Email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Photo"
            name="photo"
            rules={[
              { required: true, message: "Please select book photo" },
              // { validator: validateISBN, message: "ISBN must be a 13-digit number" },
            ]}
          >
            <Input prefix={<BarcodeOutlined />} placeholder="Author's Email" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Cover Image"
            name="file"
            
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>
                Upload png, jpeg, or jpg only
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={editMode ? isEditingBook : isAddingBook}
            >
              {editMode ? "Update" : "Save"}
            </Button>
          </Form.Item>

          <Form.Item>
            {!editMode && (
              <Button
                type="primary"
                className="bg-green-600 ml-4"
                htmlType="button"
                onClick={onReset}
              >
                Reset
              </Button>
            )}
          </Form.Item>
        </div>
    </Form>
  );
};

export default BookForm;
