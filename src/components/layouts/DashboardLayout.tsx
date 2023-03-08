import Meta from "@/components/layouts/Meta";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { USER_ROLE } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { type ReactNode } from "react";
import LoadingScreen from "../screens/LoadingScreen";
import Footer from "./Footer";
import Header from "./Header";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (
    session.user?.role !== USER_ROLE.ADMIN &&
    session.user?.role !== USER_ROLE.SUPER_ADMIN
  ) {
    return (
      <div className="grid h-screen place-items-center">
        <div className="w-96 text-center">
          <ShieldExclamationIcon
            width={64}
            height={64}
            className="mx-auto mb-2 text-danger"
          />
          <h1 className="text-lg font-bold">
            Your account is not active. <br />
            Please contact the administration.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <Meta />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default DashboardLayout;
