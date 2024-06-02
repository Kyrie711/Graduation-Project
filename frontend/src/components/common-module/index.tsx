import React, { PropsWithChildren } from 'react';
import styles from './index.module.scss';

interface IProps {
  title: string;
}

const CommonModule: React.FC<PropsWithChildren<IProps>> = ({
  title,
  children,
}) => {
  return (
    <div className={styles['common-module']}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};

export default CommonModule;
