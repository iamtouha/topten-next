import DefaultLayout from "@/components/layouts/DefaultLayout";
import type { NextPageWithLayout } from "@/pages/_app";

const Customers: NextPageWithLayout = () => {
  return <div>index</div>;
};

export default Customers;

Customers.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
