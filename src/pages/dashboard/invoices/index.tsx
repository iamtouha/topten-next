import { type NextPageWithLayout } from "@/pages/_app";
import { titleCase } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { type Profile, type User } from "@prisma/client";
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

type UserWithProfile = User & {
  profile: Profile | null;
};

// components imports
import CustomTable from "@/components/CustomTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Invoices: NextPageWithLayout = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    name: false,
    createdBy: false,
    updatedBy: false,
    updatedAt: false,
  });

  // trpc
  const {
    data: users,
    isLoading,
    isError,
  } = trpc.admin.users.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // table column
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
              cell.getValue() ? titleCase(cell.getValue()) : "-",
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
                ? dayjs(cell.getValue()).format("DD/MM/YYYY, hh:mm a")
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

  return (
    <>
      <Head>
        <title>Invoices | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container mx-auto min-h-screen max-w-screen-xl px-2 pt-5 pb-10">
        <CustomTable<UserWithProfile>
          tableTitle={`Invoices (${users?.length ?? 0} entries)`}
          columns={columns}
          data={users ?? []}
          state={{ columnVisibility }}
          setColumnVisibility={setColumnVisibility}
          isLoading={isLoading}
          isError={isError}
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
