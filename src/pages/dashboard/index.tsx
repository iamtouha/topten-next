import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { type NextPageWithLayout } from "../_app";

// components imports
import DashboardLayout from "@/components/layouts/DashboardLayout";

const dashboardRoutes = [
  { name: "Users & Employees", path: "/dashboard/users" },
  { name: "Products", path: "/dashboard/products" },
  { name: "Stores", path: "/dashboard/stores" },
  { name: "Invoices", path: "/dashboard/invoices" },
];

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-xl pt-5 pb-10 container-res">
        <ul className="mx-auto block w-64 text-center text-lg text-white">
          {dashboardRoutes.map((route) => (
            <li key={route.name} className="w-full">
              <Link
                href={route.path}
                className="my-4 block bg-primary-700 px-4 py-2 transition-colors hover:bg-primary-600"
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Dashboard;
