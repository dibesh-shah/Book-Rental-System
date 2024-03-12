import { Form, Input, Button, message } from "antd";
import { useEffect } from "react";
import { useAddCategory, useEditCategory, useUploadCategory } from "../api/category/queries";

interface CategoryFormProps {
  editMode: boolean;
  initialData: Object | null;
  onSuccess: () => void;
  onUpdateCategory: (data:any) => void;
}

const { TextArea } = Input;

const CategoryForm: React.FC<CategoryFormProps> = ({
  editMode,
  initialData,
  onSuccess,
  onUpdateCategory,
}) => {
  const [form] = Form.useForm();

  const { mutate: addCategory, isLoading: isAddingCategory } = useAddCategory();
  const { mutate: editCategory, isLoading: isEditingCategory } = useEditCategory();
  const { mutate: uploadCategory, isLoading: isUploadingCategory } = useUploadCategory();

  const onFinish = (values: any) => {
    let payload: any = {
      name: values.name,
      discription: values.discription,
    };

    if (initialData) {
      payload = { ...payload, id: initialData.id };

      editCategory(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Edited Category ${values.name} Successfully`);
          onUpdateCategory(payload);
          onReset();
        },
      });
    } else {
      addCategory(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Added Category ${values.name} Successfully`);
          onReset();
        },
      });
    }

    console.log("Received values:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form for errors.");
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    // Use setFieldsValue to set initial values after the form is mounted
    if (initialData) {
      form.setFieldsValue(initialData);
    }

    return () => {
      form.resetFields();
    };
  }, [form, initialData]);

  return (
    <Form
      form={form}
      name="categoryForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{ span: 4, offset: 0 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter the category name!" }]}
      >
        <Input placeholder="Category Name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="discription"
        rules={[
          { required: true, message: "Please enter the category description!" },
        ]}
      >
        <TextArea rows={4} placeholder="Category Description" />
      </Form.Item>

      <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={editMode ? isEditingCategory : isAddingCategory}
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

export default CategoryForm;
