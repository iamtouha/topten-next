import Meta from "@/components/layouts/Meta";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { useEffect, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import LoadingScreen from "../screens/LoadingScreen";
import Footer from "./Footer";
import Header from "./Header";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession({ required: true });

  useEffect(() => {
    if (session?.user && !session?.user?.profileId) {
      void Router.push("/complete-registration").then(() => {
        toast.error("Complete your registration.");
      });
    }
  }, [session?.user, session?.user?.profileId]);

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

export default DefaultLayout;
