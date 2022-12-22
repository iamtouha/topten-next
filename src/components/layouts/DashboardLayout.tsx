import { useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { toast } from "react-toastify";

// components imports
import Footer from "./Footer";
import Navbar from "./Navbar";
import LoadingScreen from "../LoadingScreen";
import { USER_ROLE } from "@prisma/client";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

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
      <Navbar />
      <div className="mt-20"></div>
      {children}
      <Footer />
    </>
  );
};

export default DashboardLayout;