import Button from "@/components/Button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Head from "next/head";
import Router from "next/router";
import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-xl pt-5 pb-10 container-res">
        <div className="flex items-center justify-center gap-2.5">
          <Button
            aria-label="navigate to users page"
            className="bg-primary-700"
            onClick={() => Router.push("/dashboard/users")}
          >
            Users
          </Button>
          <Button
            aria-label="navigate to products page"
            className="bg-primary-700"
            onClick={() => Router.push("/dashboard/products")}
          >
            Products
          </Button>
        </div>
      </main>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Dashboard;
