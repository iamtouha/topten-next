import type { NextPageWithLayout } from "@/pages/_app";
import styles from "@/styles/dashboard/products/product.module.css";
import { trpc, type RouterOutputs } from "@/utils/trpc";
import dayjs from "dayjs";
import Head from "next/head";
import Router from "next/router";
import { toast } from "react-toastify";
import { useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatPrice } from "@/utils/format";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateProduct({
      id: productId,
      name: data.name,
      size: data.size,
      price: data.price,
    });
    reset();
  };
  // refetch product
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.admin.products.getOne.invalidate(productId);
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
      <main className={styles.wrapper}>
        {product ? (
          <div className="grid gap-8">
            <div className="grid gap-4">
              <p className={styles.richTitle}>Update</p>
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
                  aria-label="update-product form"
                  className={styles.form}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className={styles.inputWrapper}>
                    <label
                      htmlFor="update_product_name"
                      className={styles.inputLabel}
                    >
                      Product name
                    </label>
                    <input
                      type="text"
                      id="update_product_name"
                      className={styles.input}
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
                  <div className={styles.inputWrapper}>
                    <label
                      htmlFor="update_product_size"
                      className={styles.inputLabel}
                    >
                      Product size
                    </label>
                    <input
                      type="text"
                      id="update_product_size"
                      className={styles.input}
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
                  <div className={styles.inputWrapper}>
                    <label
                      htmlFor="update_product_price"
                      className={styles.inputLabel}
                    >
                      Product price
                    </label>
                    <input
                      type="number"
                      id="update_product_price"
                      className={styles.input}
                      placeholder="Product price"
                      {...register("price", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      defaultValue={
                        updateStatus === "loading" ? "" : product?.price
                      }
                    />
                    {errors.price ? (
                      <p className="text-sm font-medium text-danger">
                        {errors.price.message}
                      </p>
                    ) : null}
                  </div>
                  <Button
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
      <p className={styles.richTitle}>Product</p>
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
              <p className={styles.richTitle}>Stock</p>
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
