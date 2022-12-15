import { useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { toast } from "react-toastify";

// components imports
import Footer from "./Footer";
import Navbar from "./Navbar";
import LoadingScreen from "../LoadingScreen";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession({ required: true });

  useEffect(() => {
    if (session?.user && !session?.user?.profileId) {
      Router.push("/complete-registration").then(() => {
        toast.error("Complete your registration.");
      });
    }
  }, [session?.user?.profileId]);

  if (status === "loading" || !session.user?.profileId) {
    return <LoadingScreen />;
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
