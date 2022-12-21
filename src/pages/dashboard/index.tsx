import DashboardLayout from "@/components/layouts/DashboardLayout";
import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return <div>Dashboard</div>;
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Dashboard;
