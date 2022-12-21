import { trpc } from "@/utils/trpc";
import Head from "next/head";
import { useMemo, useState } from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  ColumnDef,
} from "@tanstack/react-table";
import type { Product } from "@prisma/client";
import type { NextPageWithLayout } from "@/pages/_app";

// components imports
import dayjs from "dayjs";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import CustomTable from "@/components/CustomTable";
import Button from "@/components/Button";
import Link from "next/link";
import Router from "next/router";

type fieldValue = string | undefined;
const Products: NextPageWithLayout = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    createdBy: false,
    updatedBy: false,
    updatedAt: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, isRefetching } =
    trpc.admin.products.get.useQuery(
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as fieldValue,
        size: columnFilters.find((f) => f.id === "size")?.value as fieldValue,
        sortBy: sorting[0]?.id as
          | "name"
          | "createdAt"
          | "size"
          | "price"
          | "published"
          | undefined,
        sortDesc: sorting[0]?.desc,
      },
      { refetchOnWindowFocus: false }
    );

  // table column
  const columns = useMemo<ColumnDef<Product, any>[]>(
    () => [
      { accessorKey: "id", enableColumnFilter: false, enableSorting: false },
      { accessorKey: "name" },
      { accessorKey: "size" },
      { accessorKey: "price", enableColumnFilter: false },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) => dayjs(cell.getValue()).format("DD/MM/YYYY hh:mm a"),
        enableColumnFilter: false,
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ cell, row }) =>
          row.getValue("updatedBy")
            ? dayjs(cell.getValue()).format("DD/MM/YYYY hh:mm a")
            : "-",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Products | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container mx-auto min-h-screen px-2 pt-5 pb-10">
        <div className="p-2">
          <Link href={"/dashboard/products/add"}>
            <Button className="bg-primary-700">Add Product</Button>
          </Link>
        </div>

        <CustomTable
          columns={columns}
          data={data?.products ?? []}
          state={{
            sorting,
            pagination,
            columnVisibility,
            columnFilters,
          }}
          setSorting={setSorting}
          setColumnFilters={setColumnFilters}
          setColumnVisibility={setColumnVisibility}
          setPagination={setPagination}
          itemsCount={data?.count}
          isLoading={isLoading}
          isRefetching={isRefetching}
          isError={isError}
          manualFiltering
          manualPagination
          manualSorting
          rowHoverEffect
          bodyRowProps={(row) => ({
            onClick: () => {
              const productId = row.getValue("id") as string;
              Router.push("/dashboard/products/" + productId);
            },
          })}
        />
      </main>
    </>
  );
};

Products.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
