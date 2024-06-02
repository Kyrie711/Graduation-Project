import React, { useCallback, useEffect } from 'react';

import Header from '@/components/header';
import Bill from './components/bill';
import { setUser } from '@/store/auth-slice';

import styles from './index.module.scss';
import Analyze from './components/analyze';
import authService from '@/util/auth';
import { useAppDispatch } from '@/store/hooks';

// const tabs = [
//   {
//     label: `信息展示`,
//     key: '1',
//     children: <Analyze></Analyze>,
//   },
//   {
//     label: `行情分析`,
//     key: '2',
//     children: <Bill></Bill>,
//   },
// ];
const StockDetail: React.FC = () => {
  const dispatch = useAppDispatch();
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

  return (
    <div className={styles['stock-detail']}>
      <Header title="股票详情"></Header>
      <div className={styles.main}>
        {/* <Tabs type="card" items={tabs} /> */}
        <Analyze></Analyze>
        <Bill></Bill>
      </div>
    </div>
  );
};

export default StockDetail;
