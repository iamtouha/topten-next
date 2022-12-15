import { useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";

// components imports
import Footer from "./Footer";
import Navbar from "./Navbar";
import LoadingScreen from "../LoadingScreen";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import Button from "../Button";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession({ required: true });

  useEffect(() => {
    if (session?.user && !session?.user?.profileId) {
      Router.push("/complete-registration");
    }
  }, [session?.user?.profileId]);

  if (status === "loading" || !session.user?.profileId) {
    return <LoadingScreen />;
  }
  if (!session.user.active) {
    return (
      <div className="grid h-screen place-items-center">
        <div className="max-w-sm text-center">
          <NoSymbolIcon width={64} height={64} className="mx-auto" />
          <h1 className="my-4 text-lg">
            Your account is not active. Please wait for activation or contact
            the administrator.
          </h1>

          <Link href={"/"}>
            <Button intent="primary">HOME</Button>
          </Link>
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
