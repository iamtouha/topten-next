import { useSession } from "next-auth/react";
import { type ReactNode } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

// components imports
import Footer from "./Footer";
import Navbar from "./Navbar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession({ required: true });
  if (status === "loading") {
    return (
      <div className="grid place-items-center">
        <div className="animate-spin">
          <ArrowPathIcon />
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
