import { type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="mt-20"></div>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
