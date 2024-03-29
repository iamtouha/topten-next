import type { NextPageWithLayout } from "@/pages/_app";
import { api as trpc } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

// components imports

import DashboardLayout from "@/components/layouts/DashboardLayout";
import Button from "@/components/ui/Button";

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Store name must be at least 1 character" }),
  address: z
    .string()
    .min(1, { message: "Store name must be at least 1 character" }),
});
type Inputs = z.infer<typeof schema>;

const AddStore: NextPageWithLayout = () => {
  // trpc
  const { mutateAsync: addStore, status: addStatus } =
    trpc.admin.stores.create.useMutation({
      onSuccess: (store) => {
        toast.success(`${store.name}-${store.address} added successfully!`);
      },
      onError: (e) => {
        toast.error(e.message);
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
    await addStore({ ...data });
    reset();
  };

  return (
    <>
      <Head>
        <title>Add Product | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container max-w-screen-sm pt-5 pb-10">
        <form
          aria-label="add store form"
          className="grid w-full gap-2.5 whitespace-nowrap"
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          <div className="grid w-full gap-2">
            <label
              htmlFor="add-store-name"
              className="text-xs font-medium text-title md:text-sm"
            >
              Store name
            </label>
            <input
              type="text"
              id="add-store-name"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Store name"
              {...register("name", { required: true })}
            />
            {errors.name ? (
              <p className="text-sm font-medium text-danger">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="grid w-full gap-2">
            <label
              htmlFor="add-store-address"
              className="text-xs font-medium text-title md:text-sm"
            >
              Store address
            </label>
            <input
              type="text"
              id="add-store-address"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Store address"
              {...register("address", { required: true })}
            />
            {errors.address ? (
              <p className="text-sm font-medium text-danger">
                {errors.address.message}
              </p>
            ) : null}
          </div>

          <Button
            aria-label="add store"
            className="mt-2.5 w-full bg-primary-700 py-3"
            disabled={addStatus === "loading"}
          >
            {addStatus === "loading" ? "Loading..." : "Add store"}
          </Button>
        </form>
      </main>
    </>
  );
};

AddStore.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AddStore;
