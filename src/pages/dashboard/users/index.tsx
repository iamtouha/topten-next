import { trpc } from "@/utils/trpc";
import { formatRole } from "@/utils/formatStrings";
import { type NextPage } from "next";
import Head from "next/head";
import { Fragment, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { type User } from "@prisma/client";

// components imports
import Table from "@/components/Table";
import dayjs from "dayjs";
import Loader from "@/components/Loader";

const Users: NextPage = () => {
  // trpc
  const { data: queryData, status } = trpc.user.all.useInfiniteQuery(
    { limit: 10 },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
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
      <main className="mx-auto min-h-screen w-[95vw] max-w-screen-xl px-2 pt-5 pb-10">
        {status === "loading" ? (
          <Loader />
        ) : (
          // <Table intent="users" tableData={users ?? []} columns={columns} />
          <Fragment>
            {queryData?.pages.map((page, i) => (
              <div key={page.users[0]?.id || i}>
                {page.users.map((user) => (
                  <div key={user.id}>
                    <p>{user.name}</p>
                  </div>
                ))}
              </div>
            ))}
          </Fragment>
        )}
      </main>
    </>
  );
};

export default Users;
