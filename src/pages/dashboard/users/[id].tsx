import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";

// components imports
import Loader from "@/components/Loader";

const User: NextPage = () => {
  const id = useRouter().query.id as string;

  // trpc
  const { data: user, status } = trpc.user.findUserById.useQuery({ id });

  if (status === "loading") {
    return <Loader className="min-h-screen container-res" />;
  }

  return (
    <>
      <Head>
        <title>User | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen container-res">
        <div>User: {id}</div>
      </main>
    </>
  );
};

export default User;
