import type { NextPageWithLayout } from "@/pages/_app";
import { formatPrice } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import type { Store } from "@prisma/client";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useMemo, useState } from "react";

// components imports
import Button from "@/components/Button";
import CustomTable from "@/components/CustomTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type fieldValue = string | undefined;
const Stores: NextPageWithLayout = () => {
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
    trpc.admin.stores.get.useQuery(
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as fieldValue,
        sortBy: sorting[0]?.id as
          | "name"
          | "published"
          | "type"
          | "createdAt"
          | undefined,
        sortDesc: sorting[0]?.desc,
      },
      { refetchOnWindowFocus: false }
    );

  // table column
  const columns = useMemo<ColumnDef<Store, any>[]>(
    () => [
      { accessorKey: "id", enableColumnFilter: false, enableSorting: false },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "address", header: "Address" },
      {
        accessorKey: "published",
        header: "Status",
        cell: ({ cell }) => (cell.getValue() ? "Published" : "Unpublished"),
        enableColumnFilter: false,
      },
      { accessorKey: "type", header: "Store type" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) =>
          dayjs(cell.getValue()).format("DD/MM/YYYY, hh:mm a"),
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
            ? dayjs(cell.getValue()).format("DD/MM/YYYY, hh:mm a")
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
        <title>Stores | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container mx-auto min-h-screen max-w-screen-xl px-2 pt-5 pb-10">
        <CustomTable<Store>
          tableTitle={
            <>
              {`Stores (${data?.count ?? 0} entries)`}
              <Link href={"/dashboard/products/add"} className="ml-4">
                <Button className="bg-primary-700">Add store</Button>
              </Link>
            </>
          }
          columns={columns}
          data={data?.stores ?? []}
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
          disableGlobalFilter
          bodyRowProps={(row) => ({
            onClick: () => {
              const storeId = row.getValue("id") as string;
              Router.push("/dashboard/products/" + storeId);
            },
          })}
        />
      </main>
    </>
  );
};

Stores.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Stores;
