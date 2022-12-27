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
  name: z
    .string()
    .min(1, { message: "Product name must be at least 1 character" }),
  size: z
    .string()
    .min(1, { message: "Product size must be at least 1 character" }),
  price: z
    .number({
      invalid_type_error: "Please input only numbers",
    })
    .min(0, { message: "Product price must be greater than or equal 0" }),
});

const AddProduct: NextPageWithLayout = () => {
  // trpc
  const { mutateAsync: addProduct, status: addStatus } =
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
    await addProduct({ ...data });
    reset();
  };

  return (
    <>
      <Head>
        <title>Add Product | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-sm pt-5 pb-10 container-res">
        <form
          aria-label="add product form"
          className="grid w-full gap-2.5 whitespace-nowrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid w-full gap-2">
            <label
              htmlFor="add-product-name"
              className="text-xs font-medium text-title md:text-sm"
            >
              Product name
            </label>
            <input
              type="text"
              id="add-product-name"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Product name"
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
              htmlFor="add-product-size"
              className="text-xs font-medium text-title md:text-sm"
            >
              Product size
            </label>
            <input
              type="text"
              id="add-product-size"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Product size"
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
              htmlFor="add-product-price"
              className="text-xs font-medium text-title md:text-sm"
            >
              Product price
            </label>
            <input
              type="text"
              id="add-product-price"
              className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
              placeholder="Product price"
              {...register("price", { required: true, valueAsNumber: true })}
            />
            {errors.price ? (
              <p className="text-sm font-medium text-danger">
                {errors.price.message}
              </p>
            ) : null}
          </div>
          <Button
            aria-label="add product"
            className="mt-2.5 w-full bg-primary-700 py-3"
            disabled={addStatus === "loading"}
          >
            {addStatus === "loading" ? "Loading..." : "Add product"}
          </Button>
        </form>
      </main>
    </>
  );
};

AddProduct.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AddProduct;
