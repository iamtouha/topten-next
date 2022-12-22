import { type NextPageWithLayout } from "@/pages/_app";
import { formatRole } from "@/utils/formatStrings";
import { trpc } from "@/utils/trpc";
import { type User } from "@prisma/client";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type ColumnDef,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Head from "next/head";
import { useMemo, useState } from "react";
import Router from "next/router";

// components imports
import CustomTable from "@/components/CustomTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type fieldValue = string | undefined;
const Users: NextPageWithLayout = () => {
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
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "profile.fullName",
            header: () => <span>Full name</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "profile.phone",
            header: () => <span>Phone number</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "profile.designation",
            header: () => <span>Designation</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "User",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "name",
            header: () => <span>Name</span>,
          },
          {
            accessorKey: "email",
            header: () => <span>Email</span>,
          },
          {
            accessorFn: (d) => dayjs(d.createdAt).format("DD/MM/YYYY, hh:mmA"),
            id: "createdAt",
            header: () => <span>Created at</span>,
          },
          {
            accessorKey: "role",
            cell: (info) => formatRole(info.getValue()),
            header: () => <span>Role</span>,
          },
          {
            accessorFn: (d) => (d.active ? "Active" : "Inactive"),
            id: "active",
            header: () => <span>Status</span>,
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Users | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container mx-auto min-h-screen max-w-screen-xl px-2 pt-5 pb-10">
        <CustomTable<User>
          tableTitle={`Users (${data?.count ?? 0} entries)`}
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
              const userId = row.original.id as string;
              Router.push(`/dashboard/users/${userId}`);
            },
          })}
        />
      </main>
    </>
  );
};

Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Users;
