import { type NextPageWithLayout } from "@/pages/_app";
import { api as trpc } from "@/utils/api";
import { titleCase } from "@/utils/format";
import { type Profile, type User } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { useMemo } from "react";

// components imports
import CustomTable from "@/components/CustomTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type UserWithProfile = User & {
  profile: Profile | null;
};

const Orders: NextPageWithLayout = () => {
  const columns = useMemo<ColumnDef<UserWithProfile, any>[]>(
    () => [
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
            accessorKey: "role",
            header: "Role",
            cell: ({ cell }) =>
              cell.getValue() ? titleCase(cell.getValue() as string) : "-",
          },
          {
            accessorKey: "active",
            header: "Status",
            cell: ({ cell }) => (cell.getValue() ? "Active" : "Inactive"),
          },
          {
            accessorKey: "createdAt",
            header: "Created at",
            enableColumnFilter: false,
            enableGlobalFilter: false,
            cell: ({ cell }) =>
              cell.getValue()
                ? dayjs(cell.getValue() as Date).format("DD/MM/YYYY, hh:mm a")
                : "-",
          },
        ],
      },
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
    ],
    []
  );

  // trpc
  const {
    data: users,
    isLoading,
    isError,
  } = trpc.admin.users.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Head>
        <title>Invoices | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container max-w-screen-xl pt-5 pb-10">
        <CustomTable<UserWithProfile>
          tableTitle={`Invoices (${users?.length ?? 0} entries)`}
          columns={columns}
          data={users ?? []}
          isLoading={isLoading}
          isError={isError}
          rowHoverEffect
          bodyRowProps={(row) => ({
            onClick: () => {
              const id = row.original.id;
              void Router.push(`/dashboard/users/${id}`);
            },
          })}
        />
      </main>
    </>
  );
};

Orders.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Orders;
