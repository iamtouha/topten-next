import { type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

type Props = { children: ReactNode };
const StaticLayout = (props: Props) => {
  return (
    <>
      <Navbar />
      <div className="mt-20"></div>
      {props.children}
      <Footer />
    </>
  );
};
export default StaticLayout;
