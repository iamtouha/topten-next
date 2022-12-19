import type { Product } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useMemo } from "react";
import { toast } from "react-toastify";

// components imports
import Button from "@/components/Button";

const Playground: NextPage = () => {
  // table columns
  const productColumns = useMemo<ColumnDef<Product, any>[]>(
    () => [
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "price",
        cell: (info) => info.getValue(),
        header: () => <span>Price</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "size",
        cell: (info) => info.getValue(),
        header: () => <span>Size</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (d) => dayjs(d.addedAt).format("DD/MM/YYYY, hh:mmA"),
        id: "addedAt",
        cell: (info) => info.getValue(),
        header: () => <span>Added at</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Playground | Top Ten Agro Chemicals</title>
      </Head>
      <main className="flex min-h-screen max-w-screen-xl flex-col gap-8 py-10 container-res">
        <Button
          intent="primary"
          onClick={() =>
            toast.success("Do a kickflip.", { toastId: "kickflip" })
          }
        >
          Show toast
        </Button>
      </main>
    </>
  );
};

export default Playground;
