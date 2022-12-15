import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { toast } from "react-toastify";

// components imports
import Button from "@/components/Button";
import ProductTable from "@/components/ProductTable";

// data imports
import { products } from "@/data/products";

const Playground: NextPage = () => {
  return (
    <>
      <Head>
        <title>Playground | Top Ten Agro Chemicals</title>
      </Head>
      <main className="flex min-h-screen flex-col gap-8 py-10 container-res">
        <Button
          intent="primary"
          onClick={() =>
            toast.success("Do a kickflip.", { toastId: "kickflip" })
          }
        >
          Show toast
        </Button>
        <ProductTable products={products} />
      </main>
    </>
  );
};

export default Playground;
