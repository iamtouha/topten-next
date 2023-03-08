import type { NextPageWithLayout } from "@/pages/_app";
import { formatPrice } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Product } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

// components imports
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Searchbar from "@/components/Searchbar";
import Button from "@/components/ui/Button";
import { api, RouterOutputs } from "@/utils/api";

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Product name must be at least 1 character" }),
  price: z
    .number({
      invalid_type_error: "Please input only numbers",
    })
    .min(0, { message: "Product price must be greater than or equal 0" }),
});
type Inputs = z.infer<typeof schema>;

const UpdateProduct: NextPageWithLayout = () => {
  const productId = Router.query.productId as string;

  // trpc
  const utils = api.useContext();
  const {
    data: product,
    status,
    error,
  } = api.admin.products.getOne.useQuery(productId);
  // update product
  const { mutate: updateProduct, status: updateStatus } =
    api.admin.products.update.useMutation({
      onSuccess: () => {
        toast.success("Product updated!");
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });
  // delete product
  const { mutate: deleteProduct } = api.admin.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted!");
      void Router.push("/dashboard/products");
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
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateProduct({
      id: productId,
      name: data.name,
      price: data.price,
    });
  };
  // reset form on product change
  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      price: product.price,
    });
  }, [product, reset]);
  // get all products
  const { data: products } = api.admin.products.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  // refetch
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      void utils.admin.products.getOne.invalidate(productId);
      void utils.admin.products.list.invalidate();
    }
  }, [number, productId, utils]);

  return (
    <>
      <Head>
        <title>Update Product | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container max-w-screen-sm px-2 pt-5 pb-10">
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
            {`${error.message} | ${error.data?.httpStatus ?? ""}`}
          </div>
        ) : (
          <div className="grid gap-8">
            {products ? (
              <Searchbar<Product> data={products} route="products" />
            ) : null}
            <div className="grid gap-4">
              <form
                aria-label="update product form"
                className="grid gap-2.5 whitespace-nowrap"
                onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
              >
                <div className="grid gap-2">
                  <label
                    htmlFor="update-product-name"
                    className="text-xs font-medium text-title md:text-sm"
                  >
                    Product name
                  </label>
                  <input
                    type="text"
                    id="update-product-name"
                    className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                    placeholder="Product name"
                    {...register("name", { required: true })}
                    defaultValue={
                      updateStatus === "loading" ? "" : product?.name
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
                    htmlFor="update-product-price"
                    className="text-xs font-medium text-title md:text-sm"
                  >
                    Product price
                  </label>
                  <input
                    type="number"
                    id="update-product-price"
                    className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                    placeholder="Product price"
                    {...register("price", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    defaultValue={
                      updateStatus === "loading" ? 0 : product?.price
                    }
                  />
                  {errors.price ? (
                    <p className="text-sm font-medium text-danger">
                      {errors.price.message}
                    </p>
                  ) : null}
                </div>
                <Button
                  aria-label="update product"
                  className="mt-2.5 w-full bg-primary-700 py-2.5"
                  disabled={updateStatus === "loading"}
                >
                  {updateStatus === "loading" ? "Loading..." : "Update product"}
                </Button>
              </form>
              <div className="flex flex-col items-center justify-between gap-5 xs:flex-row">
                <Button
                  aria-label="update product status"
                  className={`w-full ${
                    product.published ? "bg-red-500" : "bg-primary-700"
                  }`}
                  onClick={() =>
                    updateProduct({
                      ...product,
                      published: !product.published,
                    })
                  }
                >
                  {updateStatus === "loading"
                    ? "Loading..."
                    : product.published
                    ? "Unpublish"
                    : "Publish"}
                </Button>
                <Button
                  aria-label="delete product"
                  className="w-full bg-red-500"
                  onClick={() => deleteProduct(productId)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <ProductDetails product={product} />
          </div>
        )}
      </main>
    </>
  );
};

UpdateProduct.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateProduct;

// ProductDetails
const ProductDetails = ({
  product,
}: {
  product: RouterOutputs["admin"]["products"]["getOne"];
}) => {
  const currentProduct = [
    { key: "Name", value: product?.name },
    {
      key: "Price",
      value: formatPrice(product?.price),
    },
    {
      key: "Created at",
      value: dayjs(product?.createdAt).format("DD/MM/YYYY, hh:mmA"),
    },
    { key: "Created by", value: product?.createdBy },
    {
      key: "Status",
      value: product?.published ? "Published" : "Unpublished",
    },
    { key: "Updated by", value: product?.updatedBy },
    {
      key: "Updated at",
      value: dayjs(product?.updatedAt).format("DD/MM/YYYY, hh:mmA"),
    },
  ];

  return (
    <div className="grid gap-2.5">
      <p className="text-base font-semibold text-title md:text-lg">Product</p>
      <div className="grid gap-y-2.5 sm:grid-cols-2">
        {currentProduct.map((item, i) => (
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
