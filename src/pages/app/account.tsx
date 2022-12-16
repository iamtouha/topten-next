import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";

// components imports
import Button from "@/components/Button";
import Loader from "@/components/Loader";

const Account: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Account | Top Ten Agro Chemicals</title>
      </Head>
      <main
        className={`${
          status === "loading" && "pt-0"
        } flex h-screen max-w-screen-sm flex-col items-center justify-center gap-8 pb-40 container-res`}
      >
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
            <Button intent="primary" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        ) : status === "loading" ? (
          <Loader />
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
