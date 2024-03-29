import type { NextPageWithLayout } from "@/pages/_app";
import { api as trpc } from "@/utils/api";
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
import Router from "next/router";
import { useMemo, useState } from "react";

// components imports

import CustomTable from "@/components/CustomTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Button from "@/components/ui/Button";

type fieldValue = string | undefined;

const Stores: NextPageWithLayout = () => {
  // tanstack/react-table
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
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
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
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) =>
          dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a"),
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
            ? dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a")
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

  // trpc
  const { data, isLoading, isError, isRefetching } =
    trpc.admin.stores.get.useQuery(
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as fieldValue,
        sortBy: sorting[0]?.id as
          | "name"
          | "published"
          | "createdAt"
          | undefined,
        sortDesc: sorting[0]?.desc,
      },
      { refetchOnWindowFocus: false }
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

              <Button
                className="ml-4"
                onClick={() => void Router.push("/dashboard/stores/add")}
              >
                Add store
              </Button>
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
              const storeId = row.original.id;
              void Router.push(`/dashboard/stores/${storeId}`);
            },
          })}
        />
      </main>
    </>
  );
};

Stores.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Stores;
