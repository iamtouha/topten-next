import HeroSection from "@/components/home/HeroSection";
import StaticLayout from "@/components/layouts/StaticLayout";
import Head from "next/head";
import { type NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Top Ten Agro Chemicals</title>
      </Head>
      <main className="grid min-h-screen gap-5">
        <HeroSection />
      </main>
    </>
  );
};

Home.getLayout = (page) => <StaticLayout>{page}</StaticLayout>;

export default Home;
