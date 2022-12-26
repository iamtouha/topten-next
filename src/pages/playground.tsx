import { type NextPage } from "next";
import Head from "next/head";
import { toast } from "react-toastify";

// components imports
import Button from "@/components/Button";

const Playground: NextPage = () => {
  return (
    <>
      <Head>
        <title>Playground | Top Ten Agro Chemicals</title>
      </Head>
      <main className="flex min-h-screen max-w-screen-xl flex-col gap-8 py-10 container-res">
        <Button
          aria-label="show toast"
          className="bg-primary-700"
          onClick={() =>
            toast.success("Do a kickflip.", { toastId: "kickflip" })
          }
        >
          Show toast
        </Button>
      </main>
    </>
  );
};

export default Playground;
