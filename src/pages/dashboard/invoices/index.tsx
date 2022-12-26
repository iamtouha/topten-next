import { type NextPageWithLayout } from "@/pages/_app";
import { titleCase } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { type User } from "@prisma/client";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import Head from "next/head";
import Router from "next/router";
import { useMemo, useState } from "react";
import dayjs from "dayjs";

// components imports
import CustomTable from "@/components/CustomTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type fieldValue = string | undefined;
const Invoices: NextPageWithLayout = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    name: false,
    createdBy: false,
    updatedBy: false,
    updatedAt: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // trpc
  const { data, isLoading, isError, isRefetching } =
    trpc.admin.users.get.useQuery(
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as fieldValue,
        sortBy: sorting[0]?.id as
          | "email"
          | "name"
          | "role"
          | "active"
          | "createdAt"
          | undefined,
        sortDesc: sorting[0]?.desc,
      },
      { refetchOnWindowFocus: false }
    );

  // table column
  const columns = useMemo<ColumnDef<User, any>[]>(
    () => [
      {
        header: "Profile",
        columns: [
          {
            accessorKey: "profile.fullName",
            header: "Full name",
          },
          {
            accessorKey: "profile.phone",
            header: "Phone number",
          },
          {
            accessorKey: "profile.designation",
            header: "Designation",
          },
        ],
      },
      {
        header: "User",
        columns: [
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            accessorKey: "createdAt",
            header: "Created at",
            cell: ({ cell }) =>
              cell.getValue()
                ? dayjs(cell.getValue()).format("DD/MM/YYYY, hh:mm a")
                : "-",
          },
          {
            accessorKey: "role",
            header: "Role",
            cell: ({ cell }) =>
              cell.getValue() ? titleCase(cell.getValue()) : "-",
          },
          {
            accessorKey: "active",
            header: "Status",
            cell: ({ cell }) => (cell.getValue() ? "Active" : "Inactive"),
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Invoices | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container mx-auto min-h-screen max-w-screen-xl px-2 pt-5 pb-10">
        <CustomTable<User>
          tableTitle={`Invoices (${data?.count ?? 0} entries)`}
          columns={columns}
          data={data?.users ?? []}
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
          disableGlobalFilter
          manualFiltering
          manualPagination
          manualSorting
          rowHoverEffect
          bodyRowProps={(row) => ({
            onClick: () => {
              const id = row.original.id as string;
              Router.push(`/dashboard/users/${id}`);
            },
          })}
        />
      </main>
    </>
  );
};

Invoices.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Invoices;
