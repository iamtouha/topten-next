import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { toast } from "react-toastify";

// components import
import Button from "@/components/Button";
import ProductTable from "@/components/ProductTable";

// data import
import { products } from "@/components/data/products";

const Playground: NextPage = () => {
  return (
    <>
      <Head>
        <title>Playground | Topten</title>
      </Head>
      <main className="grid min-h-screen gap-8 py-20 container-res">
        <Button
          intent="primary"
          onClick={() => toast.success("Do a kickflip.")}
        >
          Show toast
        </Button>
        <ProductTable products={products} />
      </main>
    </>
  );
};

export default Playground;
