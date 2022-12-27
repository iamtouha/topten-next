import type { NextPageWithLayout } from "@/pages/_app";
import { formatPrice } from "@/utils/format";
import { trpc, type RouterOutputs } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Product } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

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

// components imports
import Button from "@/components/Button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loader from "@/components/Loader";
import Searchbar from "@/components/Searchbar";

const UpdateProduct: NextPageWithLayout = () => {
  const productId = Router.query.productId as string;

  // trpc
  const utils = trpc.useContext();
  // find product
  const {
    data: product,
    status,
    error,
  } = trpc.admin.products.getOne.useQuery(productId);
  // update product
  const { mutateAsync: updateProduct, status: updateStatus } =
    trpc.admin.products.update.useMutation({
      onSuccess: async () => {
        toast.success("Product updated!");
      },
      onError: async (e) => {
        toast.error(e.message, { toastId: "updateProductError" });
      },
    });
  // delete product
  const { mutateAsync: deleteProduct } = trpc.admin.products.delete.useMutation(
    {
      onSuccess: async () => {
        toast.success("Product deleted!", {
          toastId: "deleteProductSuccess",
        });
        await Router.push("/dashboard/products");
      },
      onError: async (e) => {
        toast.error(e.message, { toastId: "deleteProductError" });
      },
    }
  );
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateProduct({
      id: productId,
      name: data.name,
      size: data.size,
      price: data.price,
    });
  };
  // reset form on product change
  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      size: product.size,
      price: product.price,
    });
  }, [product, reset]);
  // get all products
  const { data: products } = trpc.admin.products.list.useQuery(undefined, {
    staleTime: 30000,
  });
  // refetch
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.products.getOne.invalidate(productId);
      utils.admin.products.list.invalidate();
    }
  }, [number, productId, utils]);

  // conditional renders
  if (status === "loading") {
    return <Loader className="min-h-screen container-res" />;
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
        <title>Update Product | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-sm px-2 pt-5 pb-10 container-res">
        {product ? (
          <div className="grid gap-10">
            {products && (
              <Searchbar<Product> data={products} route="products" />
            )}
            <div className="grid gap-4">
              <p className="text-base font-medium text-success md:text-lg">
                Update
              </p>
              <div className="grid gap-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    aria-label="update product status"
                    className={
                      product.published ? "bg-red-500" : "bg-primary-700"
                    }
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
                    className="bg-red-500"
                    onClick={() => deleteProduct(productId)}
                  >
                    Delete
                  </Button>
                </div>
                <form
                  aria-label="update product form"
                  className="grid gap-2.5 whitespace-nowrap"
                  onSubmit={handleSubmit(onSubmit)}
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
                      htmlFor="update-product-size"
                      className="text-xs font-medium text-title md:text-sm"
                    >
                      Product size
                    </label>
                    <input
                      type="text"
                      id="update-product-size"
                      className="w-full px-4 py-2.5 text-xs font-medium text-title transition-colors placeholder:text-lowkey/80 md:text-sm"
                      placeholder="Product size"
                      {...register("size", { required: true })}
                      defaultValue={
                        updateStatus === "loading" ? "" : product?.size
                      }
                    />
                    {errors.size ? (
                      <p className="text-sm font-medium text-danger">
                        {errors.size.message}
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
                    className="mt-2.5 w-full bg-primary-700 py-3"
                    disabled={updateStatus === "loading"}
                  >
                    {updateStatus === "loading"
                      ? "Loading..."
                      : "Update product"}
                  </Button>
                </form>
              </div>
            </div>
            <ProductDetails product={product} />
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
    { key: "Size", value: product?.size },
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
      <p className="text-base font-medium text-success md:text-lg">Product</p>
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
      {product.stocks.length > 0
        ? product.stocks.map((stock, i) => (
            <div key={i} className="grid gap-2.5">
              <p className="text-base font-medium text-success md:text-lg">
                Stock
              </p>
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
        : null}
    </div>
  );
};
