import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';

import authService from '@/util/auth';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/auth-slice';

import Header from '../../components/header';
import Stock from './components/stock';
import Billboard from './components/billboard';

import styles from './index.module.scss';

const tabs = [
  {
    label: `股票行情总览`,
    key: '/home',
  },
  {
    label: `股票龙虎榜`,
    key: '/home/billboard',
  },
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState(() => {
    return location.pathname;
  });

  const checkAuth = useCallback(async () => {
    const { success, user } = await authService.checkAuth();
    if (success) {
      dispatch(setUser(user));
    } else {
      // 如果用户未登录，则重定向到登录页面或显示未登录提示
      // navigate('/login', {
      //   replace: true,
      // });
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, dispatch]);

  const handleTabChange = (activeKey: string) => {
    setTab(activeKey);
    navigate(activeKey);
  };

  return (
    <div>
      <Header></Header>
      {/* <div className={styles.main}> */}
      {/* <Menu
          defaultSelectedKeys={[curTab]}
          mode="inline"
          items={items}
          className={styles.menu}
        /> */}
      <div className={styles.main}>
        <div className={styles.header}>
          <Tabs
            onChange={handleTabChange}
            type="card"
            items={tabs}
            activeKey={tab}
          />
        </div>

        <Routes>
          <Route path="/" element={<Stock></Stock>}></Route>
          {/* <Route path="/compare" element={456}></Route> */}
          <Route path="/billboard" element={<Billboard></Billboard>}></Route>
        </Routes>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Home;
