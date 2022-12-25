import Head from "next/head";
import Router from "next/router";
import { type NextPageWithLayout } from "../_app";

// components imports
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Button from "@/components/Button";

const routes = [
  {
    name: "Users",
    path: "/dashboard/users",
  },
  {
    name: "Products",
    path: "/dashboard/products",
  },
  {
    name: "Stores",
    path: "/dashboard/stores",
  },
];

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-xl pt-5 pb-10 container-res">
        <div className="flex items-center gap-2.5">
          {routes.map((route) => (
            <Button
              key={route.name}
              aria-label={`navigate to ${route.name} page`}
              className="bg-primary-700"
              onClick={() => Router.push(route.path)}
            >
              {route.name}
            </Button>
          ))}
        </div>
      </main>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Dashboard;
