import Button from "@/components/Button";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "./_app";

const Four0Four: NextPageWithLayout = ({ statusCode }) => {
  return (
    <>
      <Head>
        <title>{`${statusCode}`} | Top Ten Agro Chemicals</title>
        <meta
          name="description"
          content="The page you are looking for is unavailable."
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-7 container-res">
        <h1 className="text-2xl font-semibold md:text-3xl">
          {`${statusCode}`} | Page not found
        </h1>
        <Button
          aria-label="go back to the previous route"
          className="bg-neutral-700"
          onClick={() => Router.back()}
        >
          Go back
        </Button>
      </main>
    </>
  );
};

Four0Four.getLayout = (page) => <>{page}</>;

Four0Four.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Four0Four;
