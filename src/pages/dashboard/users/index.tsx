import { formatRole } from "@/utils/formatStrings";
import { trpc } from "@/utils/trpc";
import { type User } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type NextPage } from "next";
import Head from "next/head";
import { Fragment, useMemo } from "react";

// components imports
import Loader from "@/components/Loader";
import Table from "@/components/Table";
import dayjs from "dayjs";

const Users: NextPage = () => {
  // trpc
  const usersQuery = trpc.user.all.useInfiniteQuery(
    { limit: 1 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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
      <main className="container mx-auto min-h-screen max-w-screen-2xl px-2 pt-5 pb-10">
        {usersQuery.status === "loading" ? (
          <Loader />
        ) : (
          <>
            <Table<User> intent="users" columns={columns} />
            <Fragment>
              {usersQuery.data?.pages.map((page, i) => (
                <Fragment key={page.users[0]?.id || i}>
                  {page.users.map((user) => (
                    <p key={user.id}>{user.name}</p>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          </>
        )}
      </main>
    </>
  );
};

export default Users;
