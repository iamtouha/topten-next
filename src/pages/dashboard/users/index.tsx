import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import Head from "next/head";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Profile } from "@prisma/client";

// components imports
import Table from "@/components/Table";

const Users: NextPage = () => {
  // trpc
  const { data: profiles, status } = trpc.user.allProfiles.useQuery(undefined, {
    staleTime: 3000,
  });

  // table column
  const profileColumns = useMemo<ColumnDef<Profile, any>[]>(
    () => [
      {
        accessorKey: "fullName",
        cell: (info) => info.getValue(),
        header: () => <span>Full name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "phone",
        cell: (info) => info.getValue(),
        header: () => <span>Phone number</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "designation",
        cell: (info) => info.getValue(),
        header: () => <span>Designation</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Users | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen pt-5 pb-10 container-res">
        {status === "loading" ? (
          <p
            role="progressbar"
            className="text-sm font-medium text-neutral-700 md:text-base"
          >
            Loading...
          </p>
        ) : (
          status === "success" && (
            <Table
              intent="profiles"
              tableData={profiles}
              columns={profileColumns}
            />
          )
        )}
      </main>
    </>
  );
};

export default Users;
