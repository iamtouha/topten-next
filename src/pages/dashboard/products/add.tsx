import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

// components imports
import Button from "@/components/Button";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type Inputs = {
  name: string;
  size: string;
  price: number;
};

const schema = z.object({
  name: z.string({ required_error: "Name is required" }),
  size: z.string({ required_error: "Size is required" }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Please input only numbers",
    })
    .min(0),
});

const AddProduct: NextPageWithLayout = () => {
  // trpc
  const { mutateAsync: addItem, status: addStatus } =
    trpc.admin.products.create.useMutation({
      onSuccess: async (product) => {
        toast.success(`${product.name}-${product.size} added successfully!`);
      },
      onError: (e) => {
        toast.error(e.message, { toastId: "addProductError" });
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
    await addItem({ ...data });
    reset();
  };

  return (
    <>
      <Head>
        <title>Add Product | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-sm pt-5 pb-10 container-res">
        <form
          aria-label="add-product form"
          className="md:text-sm; grid gap-2 whitespace-nowrap text-xs"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid w-full gap-2">
            <label
              htmlFor="add_product_name"
              className="text-sm font-medium text-title md:text-base"
            >
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-title transition-colors placeholder:text-lowkey"
              id="add_product_name"
              placeholder="Name"
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
              htmlFor="add_prduct_size"
              className="text-sm font-medium text-title md:text-base"
            >
              Size
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-title transition-colors placeholder:text-lowkey"
              id="add_prduct_size"
              placeholder="Size"
              {...register("size", { required: true })}
            />
            {errors.size ? (
              <p className="text-sm font-medium text-danger">
                {errors.size.message}
              </p>
            ) : null}
          </div>
          <div className="grid w-full gap-2">
            <label
              htmlFor="add_prouct_price"
              className="text-sm font-medium text-title md:text-base"
            >
              Price
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-title transition-colors placeholder:text-lowkey"
              id="add_prouct_price"
              placeholder="Price"
              {...register("price", { required: true, valueAsNumber: true })}
            />
            {errors.price ? (
              <p className="text-sm font-medium text-danger">
                {errors.price.message}
              </p>
            ) : null}
          </div>
          <Button
            className="mt-2.5 w-full bg-primary-700 py-3"
            disabled={addStatus === "loading"}
          >
            {addStatus === "loading" ? "Loading..." : "Add"}
          </Button>
        </form>
      </main>
    </>
  );
};

AddProduct.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AddProduct;
