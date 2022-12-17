import { trpc } from "@/utils/trpc";
import { formatRole } from "@/utils/formatStrings";
import Head from "next/head";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { type User } from "@prisma/client";
import type { NextPageWithLayout } from "@/pages/_app";

// components imports
import Table from "@/components/Table";
import dayjs from "dayjs";
import Loader from "@/components/Loader";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Users: NextPageWithLayout = () => {
  // trpc
  const { data: users, status } = trpc.user.getAllUsers.useQuery(undefined, {
    staleTime: 3000,
  });

  // table column
  const columns = useMemo<ColumnDef<User, any>[]>(
    () => [
      {
        header: "User profile",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "profile.fullName",
            cell: (info) => info.getValue(),
            header: () => <span>Full name</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "profile.phone",
            cell: (info) => info.getValue(),
            header: () => <span>Phone number</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "profile.designation",
            cell: (info) => info.getValue(),
            header: () => <span>Designation</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "User information",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "name",
            cell: (info) => info.getValue(),
            header: () => <span>Name</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "email",
            cell: (info) => info.getValue(),
            header: () => <span>Email</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (d) => dayjs(d.createdAt).format("DD/MM/YYYY, hh:mmA"),
            id: "createdAt",
            cell: (info) => info.getValue(),
            header: () => <span>Created at</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "role",
            cell: (info) => formatRole(info.getValue()),
            header: () => <span>Role</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (d) => (d.active ? "Active" : "Inactive"),
            id: "active",
            cell: (info) => info.getValue(),
            header: () => <span>Status</span>,
            footer: (props) => props.column.id,
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
      <main className="container min-h-screen px-2 pt-5 pb-10">
        {status === "loading" ? (
          <Loader />
        ) : (
          <Table intent="users" tableData={users ?? []} columns={columns} />
        )}
      </main>
    </>
  );
};

Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Users;
