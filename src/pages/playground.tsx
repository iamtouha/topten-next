import Button from "@/components/Button";

import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { toast } from "react-toastify";

const Playground: NextPage = () => {
  return (
    <>
      <Head>
        <title>Playground | Topten</title>
      </Head>
      <main className="min-h-screen py-20 container-res">
        <Button
          intent="primary"
          onClick={() => toast.success("Do a kickflip.")}
        >
          Show toast
        </Button>
      </main>
    </>
  );
};

export default Playground;
