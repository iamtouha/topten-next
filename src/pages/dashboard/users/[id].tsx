import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";

const User: NextPage = () => {
  const id = useRouter().query.id as string;

  // trpc
  const { data: user, status } = trpc.user.findUserById.useQuery({ id });

  if (status === "loading") {
    return (
      <p
        role="progressbar"
        className="text-sm font-medium text-neutral-700 md:text-base"
      >
        Loading...
      </p>
    );
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
