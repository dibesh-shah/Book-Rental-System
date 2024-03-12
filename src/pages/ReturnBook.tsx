import { useState } from "react";
import { Space, Table , Button, Drawer } from "antd";
import type { TableProps } from "antd";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';

import { ReturnData } from "../assets/static-data";
import ReturnForm from "./ReturnForm";


interface ReturnDataType{
  key : string ;
  name : string ;
  code : string ;
}

const ReturnBook: React.FC = () => {

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedReturnData, setSelectedReturnData] = useState(null);

  const showDrawer = (editMode : boolean, returnData ) => {
    setEditMode(editMode);
    setSelectedReturnData(returnData);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedReturnData(null);
    // console.log('closed')
  };

  const columns : TableProps<ReturnDataType>['columns'] = [
    {
      title : 'SN' ,
      dataIndex : 'key' ,
      key : 'SN' ,
    },
    {
      title : 'Name' ,
      dataIndex : 'name' ,
      key : 'name' ,
    },
    {
      title : 'Code' ,
      dataIndex : 'code' ,
      key : 'code' ,
    },
    {
      title : 'Action' ,
      key : 'action' ,
      render: (_, _record) => (
        <Space size="middle">
          <Button  type="default" icon={<EditOutlined />} onClick={() => {showDrawer(true, _record); console.log(_record)}}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />}  onClick={() => console.log('delete clicked')}>
            Delete
          </Button>
        </Space>
      ),
  
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">Return Book</h2>
        </div>

        <Button type="primary" className="bg-blue-600 text-white" onClick={() => showDrawer(false, null)}>Create</Button>
      </div>

      <Drawer title={editMode ? 'Edit Return' : 'Return Book'} width={700} onClose={onClose} open={open} >
        <ReturnForm editMode={editMode} initialData={selectedReturnData}  />
      </Drawer>

      <Table columns={columns} dataSource={ReturnData} bordered   />
    </div>
    
  );
};

export default ReturnBook;
