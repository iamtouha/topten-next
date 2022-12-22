import styles from "@/styles/dashboard/products/product.module.css";
import type { NextPageWithLayout } from "@/pages/_app";
import { type RouterOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import Router from "next/router";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// components imports
import Button from "@/components/Button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loader from "@/components/Loader";

const UpdateProduct: NextPageWithLayout = () => {
  const productId = Router.query.productId as string;

  // trpc
  const utils = trpc.useContext();
  const {
    data: product,
    status,
    error,
  } = trpc.admin.products.getOne.useQuery(productId);

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
            <ProductDetails product={product} />
            <div className="items-center justify-center">
              <p className={styles.richTitle}>Update</p>
              <div className="mt-2 flex items-center gap-2.5"></div>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-neutral-700 md:text-base">
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
      value: `${product?.price} Tk`,
    },
    {
      key: "Created at",
      value: dayjs(product?.createdAt).format("DD/MM/YYYY, hh:mmA"),
    },
    { key: "Created by", value: product?.createdBy },
    {
      key: "Status",
      value: product?.published ? "Published" : "Not published",
    },
    { key: "Updated by", value: product?.updatedBy },
    {
      key: "Updated at",
      value: dayjs(product?.updatedAt).format("DD/MM/YYYY, hh:mmA"),
    },
  ];

  return (
    <div className="grid gap-2.5">
      <div className="grid gap-y-2.5 sm:grid-cols-2">
        <p className={styles.richTitle}>Product</p>
        {currentProduct.map((item, i) => (
          <div key={i} className="flex gap-2">
            <p className="text-sm font-medium md:text-base">{item.key}:</p>
            <p className="text-sm text-neutral-900 md:text-base">
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
