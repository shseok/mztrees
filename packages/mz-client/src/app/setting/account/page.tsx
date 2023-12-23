import BasicLayout from '@/components/layout/BasicLayout';
import AccountSetting from '@/components/setting/AccountSetting';

export default function Account() {
  return (
    <BasicLayout title='내 계정' hasBackButton>
      <AccountSetting />
    </BasicLayout>
  );
}
