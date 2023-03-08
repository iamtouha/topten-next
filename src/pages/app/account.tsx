import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";

// components imports
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

const Account: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Account | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container grid max-w-screen-sm place-items-center gap-8 pt-32 pb-40">
        {session ? (
          <div className="grid place-items-center gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold md:text-base">Name:</p>
              <p className="text-sm md:text-base">{session.user?.name}</p>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <p className="text-sm font-semibold md:text-base">Email:</p>
              <p className="text-sm md:text-base">{session.user?.email}</p>
            </div>
            <Button
              aria-label="sign out"
              className="bg-red-500"
              onClick={() => void signOut()}
            >
              Sign out
            </Button>
          </div>
        ) : status === "loading" ? (
          <Loader />
        ) : (
          <p className="text-sm font-medium text-neutral-700 md:text-base">
            No user found
          </p>
        )}
      </main>
    </>
  );
};

export default Account;
