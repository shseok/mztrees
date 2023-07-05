import BasicLayout from "@/components/layout/BasicLayout";
import EditForm from "@/components/write/EditForm";
import { getItem } from "@/lib/api/items";

type Params = {
  params: {
    id: string;
  };
};

export default async function Edit({ params: { id } }: Params) {
  const item = await getItem(parseInt(id));

  return (
    <BasicLayout title="수정" hasBackButton>
      <EditForm item={item} />
    </BasicLayout>
  );
}
