import type { NextPageWithLayout } from "@/pages/_app";
import { trpc, type RouterOutputs } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { STORE_TYPE, type Store } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { titleCase } from "@/utils/format";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

type Inputs = {
  name: string;
  address: string;
  type: STORE_TYPE;
};

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Store name must be at least 1 character" }),
  address: z
    .string()
    .min(1, { message: "Store name must be at least 1 character" }),
  type: z.nativeEnum(STORE_TYPE),
});

// components imports
import Button from "@/components/Button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loader from "@/components/Loader";
import Searchbar from "@/components/Searchbar";

const UpdateStore: NextPageWithLayout = () => {
  const storeId = Router.query.storeId as string;

  // trpc
  const utils = trpc.useContext();
  // find store
  const {
    data: store,
    status,
    error,
  } = trpc.admin.stores.getOne.useQuery(storeId);
  // update store
  const { mutateAsync: updateStore, status: updateStatus } =
    trpc.admin.stores.update.useMutation({
      onSuccess: async () => {
        toast.success("Store updated!");
      },
      onError: async (e) => {
        toast.error(e.message, { toastId: "updateStoreError " });
      },
    });
  // delete store
  const { mutateAsync: deleteStore } = trpc.admin.stores.delete.useMutation({
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
    await updateStore({
      id: storeId,
      name: data.name,
      address: data.address,
      type: data.type,
    });
  };
  // reset form on store change
  useEffect(() => {
    if (!store) return;
    reset({
      name: store.name,
      address: store.address,
      type: store.type,
    });
  }, [store, reset]);
  // get all stores
  const { data: stores } = trpc.admin.stores.list.useQuery(undefined, {
    staleTime: 30000,
  });
  // refetch
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.stores.getOne.invalidate(storeId);
      utils.admin.stores.list.invalidate();
    }
  }, [number, storeId, utils]);

  // conditional renders
  if (status === "loading") {
    return <Loader className="grid min-h-screen container-res" />;
  }

  if (status === "error") {
    return (
      <div className="grid min-h-screen place-items-center text-base container-res md:text-lg">
        {`${error.message} | ${error.data?.httpStatus}`}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Update Store | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-sm px-2 pt-5 pb-10 container-res">
        {store ? (
          <div className="grid gap-10">
            {stores && <Searchbar<Store> data={stores} route="stores" />}
            <div className="grid gap-4">
              <p className="text-base font-medium text-success md:text-lg">
                Update
              </p>
              <div className="grid gap-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    aria-label="update store status"
                    className={
                      store.published ? "bg-red-500" : "bg-primary-700"
                    }
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
                    className="bg-red-500"
                    onClick={() => deleteStore(storeId)}
                  >
                    Delete
                  </Button>
                </div>
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
                  <div className="grid gap-2">
                    <label
                      htmlFor="update-store-type"
                      className="text-xs font-medium text-title md:text-sm"
                    >
                      Store type
                    </label>
                    <select
                      id="update-store-type"
                      className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors md:text-sm"
                      {...register("type", { required: true })}
                      defaultValue={
                        updateStatus === "loading" ? "" : store?.type
                      }
                    >
                      <option value="" hidden>
                        Select store type
                      </option>
                      {Object.values(STORE_TYPE).map((type) => (
                        <option key={type} value={type}>
                          {titleCase(type)}
                        </option>
                      ))}
                    </select>
                    {errors.type ? (
                      <p className="text-sm font-medium text-danger">
                        {errors.type.message}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    aria-label="update store"
                    className="mt-2.5 w-full bg-primary-700 py-3"
                    disabled={updateStatus === "loading"}
                  >
                    {updateStatus === "loading" ? "Loading..." : "Update store"}
                  </Button>
                </form>
              </div>
            </div>
            <StoreDetails store={store} />
          </div>
        ) : (
          <p className="text-sm font-medium text-title md:text-base">
            No product with this id
          </p>
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
      key: "Type",
      value: store.type === STORE_TYPE.INVENTORY ? "Inventory" : "Distribution",
    },
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
      <p className="text-base font-medium text-success md:text-lg">Store</p>
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
      {/* {store.stocks.length > 0
        ? store.stocks.map((stock, i) => (
            <div key={i} className="grid gap-2.5">
              <p className="text-base font-medium text-success md:text-lg">Stock</p>
              <div className="grid gap-y-2.5 pt-2.5 sm:grid-cols-2">
                <div className="flex gap-2">
                  <p className="text-sm font-medium md:text-base">Quantity:</p>
                  <p className="text-sm text-neutral-900 md:text-base">
                    {stock.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))
        : null} */}
    </div>
  );
};
