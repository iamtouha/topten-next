import { type NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import React from "react";

const User: NextPage = () => {
  const { id } = Router.query;

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
