import Head from "next/head";
import { NextPageWithLayout } from "./_app";

const Four0Four: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>404 | Top Ten Agro Chemicals</title>
        <meta
          name="description"
          content="The page you are looking for is unavailable."
        />
      </Head>
      <main>
        <h1>Page not found</h1>
      </main>
    </>
  );
};

Four0Four.getLayout = (page) => <>{page}</>;

export default Four0Four;
