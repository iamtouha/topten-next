import Meta from "@/components/layouts/Meta";
import Head from "next/head";
import { type ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

type Props = { children: ReactNode };
const StaticLayout = (props: Props) => {
  return (
    <>
      <Head>
        <Meta />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{props.children}</div>
        <Footer />
      </div>
    </>
  );
};
export default StaticLayout;
