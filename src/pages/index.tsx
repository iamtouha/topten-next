import Head from "next/head";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

// components import
import StaticLayout from "@/components/layout/StaticLayout";
import HeroSection from "@/components/home/HeroSection";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Top Ten Agro Chemicals</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <main className="grid gap-5">
        <HeroSection />
      </main>
    </>
  );
};

Home.getLayout = (page) => <StaticLayout>{page}</StaticLayout>;

export default Home;
