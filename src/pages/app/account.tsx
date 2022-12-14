import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

// components imports
import Button from "@/components/Button";

const Account: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Account | Topten</title>
      </Head>
      <main className="flex min-h-screen flex-col gap-8 py-10 container-res">
        {session ? (
          <div className="grid place-items-center gap-2">
            <Image
              src={session.user?.image as string}
              alt={session.user?.name as string}
              width={125}
              height={125}
              className="cursor-pointer rounded-full"
              priority
            />
            <div className="flex items-center gap-2 ">
              <p className="text-sm font-semibold md:text-base">Name:</p>
              <p className="text-sm md:text-base">{session.user?.name}</p>
            </div>
            <div className="flex items-center gap-2 ">
              <p className="text-sm font-semibold md:text-base">Email:</p>
              <p className="text-sm md:text-base">{session.user?.email}</p>
            </div>
            <div className="flex items-center gap-2 ">
              <p className="text-sm font-semibold md:text-base">Role:</p>
              <p className="text-sm capitalize md:text-base">
                {session.user?.role.toLowerCase()}
              </p>
            </div>
            <Button
              intent="primary"
              className="mt-5"
              onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            >
              Sign out
            </Button>
          </div>
        ) : status === "loading" ? (
          <p className="text-sm font-medium text-neutral-700 md:text-base">
            Loading...
          </p>
        ) : (
          <p className="text-sm font-medium text-neutral-700 md:text-base">
            No user found.
          </p>
        )}
      </main>
    </>
  );
};

export default Account;
