import type { NextPageWithLayout } from "@/pages/_app";
import { trpc, type RouterOutputs } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROLE_TYPE, type Store, USER_ROLE, Role } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { titleCase } from "@/utils/format";
import { useEffect, useState, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

// components imports
import Button from "@/components/Button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Searchbar from "@/components/Searchbar";
import CustomTable from "@/components/CustomTable";
import { ColumnDef } from "@tanstack/react-table";

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Store name must be at least 1 character" }),
  address: z
    .string()
    .min(1, { message: "Store name must be at least 1 character" }),
});
type Inputs = z.infer<typeof schema>;

const UpdateStore: NextPageWithLayout = () => {
  const storeId = Router.query.storeId as string;
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<ROLE_TYPE | "">("");

  const {
    data: store,
    status,
    error,
    refetch: refetchStore,
  } = trpc.admin.stores.getOne.useQuery(storeId, {
    refetchOnWindowFocus: false,
  });

  // select role
  const { data: profiles } = trpc.admin.users.profileList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { mutate: addRole } = trpc.admin.stores.addRole.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.type.toLowerCase()} role added`);
      setSelectedProfileId("");
      setSelectedRole("");
      refetchStore();
    },
    onError: () => {
      toast.error("Create Role Error");
    },
  });
  const deleteRoleMutation = trpc.admin.stores.deleteRole.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.type.toLowerCase()} role deleted`);
      refetchStore();
    },
    onError: () => {
      toast.error("Delete Role Error");
    },
  });

  // update store
  const { mutate: updateStore, status: updateStatus } =
    trpc.admin.stores.update.useMutation({
      onSuccess: async () => {
        toast.success("Store updated!");
      },
      onError: async (e) => {
        toast.error(e.message, { toastId: "updateStoreError " });
      },
    });
  // delete store
  const { mutate: deleteStore } = trpc.admin.stores.delete.useMutation({
    onSuccess: async () => {
      toast.success("Store deleted!", {
        toastId: "deleteStoreSuccess",
      });
      await Router.push("/dashboard/stores");
    },
    onError: async (e) => {
      toast.error(e.message, { toastId: "deleteStoreError" });
    },
  });
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    updateStore({
      id: storeId,
      name: data.name,
      address: data.address,
    });
  };
  // reset form on store change
  useEffect(() => {
    if (!store) return;
    reset({
      name: store.name,
      address: store.address,
    });
  }, [store, reset]);
  // get all stores
  const { data: stores } = trpc.admin.stores.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setSelectedProfileId("");
    setSelectedRole("");
  }, [storeId]);

  return (
    <>
      <Head>
        <title>Update Store | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-sm px-2 pt-5 pb-10 container-res">
        {status === "loading" ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            Loading...
          </div>
        ) : status === "error" ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            {`${error.message} | ${error.data?.httpStatus}`}
          </div>
        ) : (
          <>
            <div className="grid gap-8">
              {stores ? (
                <Searchbar<Store> data={stores} route="stores" />
              ) : null}
              <StoreDetails store={store} />
              <div className="grid gap-4">
                <form
                  aria-label="update store form"
                  className="grid gap-2.5 whitespace-nowrap"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="grid gap-2">
                    <label
                      htmlFor="update-store-name"
                      className="text-xs font-medium text-title md:text-sm"
                    >
                      Store name
                    </label>
                    <input
                      type="text"
                      id="update-store-name"
                      className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                      placeholder="Store name"
                      {...register("name", { required: true })}
                      defaultValue={
                        updateStatus === "loading" ? "" : store?.name
                      }
                    />
                    {errors.name ? (
                      <p className="text-sm font-medium text-danger">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="update-store-address"
                      className="text-xs font-medium text-title md:text-sm"
                    >
                      Store address
                    </label>
                    <input
                      type="text"
                      id="update-store-address"
                      className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                      placeholder="Store address"
                      {...register("address", { required: true })}
                      defaultValue={
                        updateStatus === "loading" ? "" : store?.address
                      }
                    />
                    {errors.address ? (
                      <p className="text-sm font-medium text-danger">
                        {errors.address.message}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    aria-label="update store"
                    className="mt-2.5 w-full bg-primary-700 py-2.5"
                    disabled={updateStatus === "loading"}
                  >
                    {updateStatus === "loading" ? "Loading..." : "Update store"}
                  </Button>
                </form>
                <div className="flex flex-col items-center justify-between gap-5 xs:flex-row">
                  <Button
                    aria-label="update store status"
                    className={`w-full ${
                      store.published ? "bg-red-500" : "bg-primary-700"
                    }`}
                    onClick={() =>
                      updateStore({
                        ...store,
                        published: !store.published,
                      })
                    }
                  >
                    {updateStatus === "loading"
                      ? "Loading..."
                      : store.published
                      ? "Unpublish"
                      : "Publish"}
                  </Button>
                  <Button
                    aria-label="delete store"
                    className="w-full bg-red-500"
                    onClick={() => deleteStore(storeId)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="mb-4 text-base font-semibold text-title md:text-lg">
                Add a Role
              </p>
              <div className="mb-8 flex w-full justify-between gap-2">
                <div className="flex-1">
                  <select
                    className="w-full"
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    id="select-user"
                  >
                    <>
                      <option value="" disabled>
                        Select a user
                      </option>
                      {profiles?.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.fullName}
                        </option>
                      ))}
                    </>
                  </select>
                </div>
                <div>
                  <select
                    id="select-user"
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(e.target.value as ROLE_TYPE)
                    }
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value={ROLE_TYPE.DIRECTOR}>Director</option>
                    <option value={ROLE_TYPE.MANAGER}>Manager</option>
                    <option value={ROLE_TYPE.OFFICER}>Officer</option>
                  </select>
                </div>
                <Button
                  disabled={!selectedProfileId || !selectedRole}
                  onClick={() =>
                    addRole({
                      storeId: store.id,
                      profileId: selectedProfileId,
                      roleType: selectedRole ? selectedRole : ROLE_TYPE.OFFICER,
                    })
                  }
                >
                  Add Role
                </Button>
              </div>
              <RolesTable
                roles={store.roles.map((role) => {
                  const user = profiles?.find((p) => p.id === role.profileId);
                  return {
                    name: user?.fullName ?? "",
                    ...role,
                  };
                })}
                deleteRole={deleteRoleMutation.mutate}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
};

UpdateStore.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateStore;

// StoreDetails
const StoreDetails = ({
  store,
}: {
  store: RouterOutputs["admin"]["stores"]["getOne"];
}) => {
  const currentStore = [
    { key: "Name", value: store?.name },
    { key: "Address", value: store?.address },

    {
      key: "Created at",
      value: dayjs(store?.createdAt).format("DD/MM/YYYY, hh:mmA"),
    },
    { key: "Created by", value: store?.createdBy },
    {
      key: "Status",
      value: store?.published ? "Published" : "Unpublished",
    },
    { key: "Updated by", value: store?.updatedBy },
    {
      key: "Updated at",
      value: dayjs(store?.updatedAt).format("DD/MM/YYYY, hh:mmA"),
    },
  ];

  return (
    <div className="grid gap-2.5">
      <p className="text-base font-semibold text-title md:text-lg">Store</p>
      <div className="grid gap-y-2.5 sm:grid-cols-2">
        {currentStore.map((item, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <p className="text-sm font-medium text-title md:text-base">
              {item.key}:
            </p>
            <p className="text-sm text-title line-clamp-1 md:text-base">
              {item.value ?? "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

type RolesTableProps = {
  roles: (Role & { name: string })[];
  deleteRole: (profileId: string) => unknown;
};

const RolesTable = ({ roles, deleteRole }: RolesTableProps) => {
  const columns = useMemo<ColumnDef<Role & { name: string }>[]>(
    () => [
      { accessorKey: "name", enableColumnFilter: false },
      { accessorKey: "type", enableColumnFilter: false },
      {
        accessorKey: "addedAt",
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: (cell) =>
          dayjs(cell.getValue() as Date).format("DD/MM/YYYY HH:mm a"),
      },
      {
        accessorKey: "addedBy",
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "action",
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableSorting: false,
        cell: (props) => {
          return (
            <Button
              className="bg-red-100 px-2 py-1 text-red-500"
              onClick={() => deleteRole(props.row.original.id)}
            >
              Delete
            </Button>
          );
        },
      },
    ],
    []
  );
  return (
    <div className="overflow-x-auto">
      <CustomTable
        tableTitle={
          <p className="text-base font-semibold text-title md:text-lg">
            Store Roles
          </p>
        }
        columns={columns}
        data={roles}
        state={{
          columnVisibility: { addedAt: false, addedBy: false },
        }}
      ></CustomTable>
    </div>
  );
};
