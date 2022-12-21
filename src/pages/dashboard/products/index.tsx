import { trpc } from "@/utils/trpc";
import { formatRole } from "@/utils/formatStrings";
import Head from "next/head";
import { useMemo, useState } from "react";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  type ColumnDef,
} from "@tanstack/react-table";
import { Product, type User } from "@prisma/client";
import type { NextPageWithLayout } from "@/pages/_app";

// components imports
import Table from "@/components/Table";
import dayjs from "dayjs";
import Loader from "@/components/Loader";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomTable from "@/components/CustomTable";
import Button from "@/components/Button";
import Link from "next/link";

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
        size: columnFilters.find((f) => f.id === "name")?.value as fieldValue,
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
          itemsCount={data?.count}
          isLoading={isLoading}
          isRefetching={isRefetching}
          isError={isError}
          setSorting={setSorting}
          setColumnFilters={setColumnFilters}
          setColumnVisibility={setColumnVisibility}
          setPagination={setPagination}
          manualFiltering
          manualPagination
          manualSorting
        />
      </main>
    </>
  );
};

Products.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
