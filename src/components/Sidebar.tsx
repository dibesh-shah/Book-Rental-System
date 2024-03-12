import React, { useState } from 'react';
import {SettingOutlined,FileOutlined,UserOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom'; 
import {  Layout, Menu } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  link?: string ,
): MenuItem {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={link}>{label}</Link> : label,
  } as MenuItem;
}

const userRole = localStorage.getItem('userRole')

const items: MenuItem[] = [
  getItem('Manage Data', '1', <SettingOutlined />, [
    getItem('Author Setup', '2', undefined, undefined, 'author-setup',),
    getItem('Category Setup', '3', undefined, undefined, 'category-setup',),
    getItem('Member Setup', '4', undefined, undefined, 'member-setup',),
    getItem('Book Setup', '5', undefined, undefined, 'book-setup',),
  ]),
  getItem('Transaction', '6', <FileOutlined />, [
    getItem('Rent a Book', '7', undefined, undefined, 'rent-book',),
    getItem('History', '8', undefined, undefined, 'transaction-history',),
  ]),
  userRole === 'ADMIN' && getItem('Manage User', '9', <UserOutlined />, undefined, 'manage-user') || null,
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light">
      <div className="demo-logo-vertical text-center">
        <div className="flex items-center justify-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <div className="text-lg font-bold mb-6">Book Rental System</div>
      </div>
        
        <Menu theme="light"  defaultOpenKeys={['1','6']} mode="inline" items={items} />
      </Sider>
  );
};

export default Sidebar;