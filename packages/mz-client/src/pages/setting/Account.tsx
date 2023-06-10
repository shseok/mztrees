import React from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import AccountSetting from '~/components/setting/AccountSetting';

const Account = () => {
  return (
    <BasicLayout title='내 계정' hasBackButton>
      <AccountSetting />
    </BasicLayout>
  );
};

export default Account;
