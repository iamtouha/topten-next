import { trpc } from "@/utils/trpc";
import { formatRole } from "@/utils/formatStrings";
import Head from "next/head";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Product, type User } from "@prisma/client";
import type { NextPageWithLayout } from "@/pages/_app";

import Loader from "@/components/Loader";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomTable from "@/components/CustomTable";
import Button from "@/components/Button";
import Link from "next/link";
import { toast } from "react-toastify";

const AddProduct: NextPageWithLayout = () => {
  // trpc
  const { mutate: addProduct } = trpc.admin.products.create.useMutation({
    onSuccess: (prod) => {
      toast.success(`${prod.name}-${prod.size} added successfully!`);
    },
    onError: () => {
      toast.error(`An error occured. could not add this product.`);
    },
  });

  // table column

  return (
    <>
      <Head>
        <title>Add Product | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container min-h-screen px-2 pt-5 pb-10">
        <form className="flex flex-col gap-2">
          <label>
            Product Name
            <input name="name" type="text" />
          </label>
          <label>
            Product Size
            <input name="size" type="text" />
          </label>
          <label>
            Product Price
            <input name="price" type="number" />
          </label>
          <Button className="bg-primary-700">Submit</Button>
        </form>
      </main>
    </>
  );
};

AddProduct.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AddProduct;
