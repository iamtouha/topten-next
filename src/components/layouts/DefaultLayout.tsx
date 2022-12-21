import { useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { toast } from "react-toastify";

// components imports
import Footer from "./Footer";
import Navbar from "./Navbar";
import LoadingScreen from "../LoadingScreen";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession({ required: true });

  useEffect(() => {
    if (session?.user && !session?.user?.profileId) {
      Router.push("/complete-registration").then(() => {
        toast.error("Complete your registration.", {
          toastId: "completeRegistrationRedirect",
        });
      });
    }
  }, [session?.user?.profileId]);

  if (status === "loading" || !session.user?.profileId) {
    return <LoadingScreen />;
  }

  if (!session.user.active) {
    return (
      <div className="grid h-screen place-items-center">
        <div className="w-96 text-center">
          <ExclamationTriangleIcon
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

export default DefaultLayout;
