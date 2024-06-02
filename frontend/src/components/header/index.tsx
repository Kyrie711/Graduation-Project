import React from 'react';
import { LineChartOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/store/hooks';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

interface IProps {
  title?: string;
  needNavigate?: boolean;
}

const Header: React.FC<IProps> = ({ title, needNavigate = false }) => {
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={() => navigate('/login')}>重新登录</a>,
    },
  ];

  return (
    <div className={styles.header}>
      <LineChartOutlined
        style={{
          color: '#1798ff',
          fontSize: '32px',
        }}
      />
      <div
        className={styles.title}
        style={{ marginRight: 20, cursor: 'pointer' }}
        onClick={() => {
          if (needNavigate) {
            navigate('/home');
          }
        }}
      >
        {title || '股票分析中心'}
      </div>
      <span>您好，{user.username || '游客'}!</span>
      {!user.username && (
        <Button type="link" onClick={() => navigate('/login')}>
          去登录
        </Button>
      )}
      <div className={styles['user-wrapper']}>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <div
            className={styles.user}
            onClick={() => {
              if (!user.username) {
                navigate('/login');
              } else {
                navigate('/user');
              }
            }}
          >
            <UserOutlined style={{ marginRight: 4 }} />
            <span>个人中心</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
