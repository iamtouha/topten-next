import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import StaticLayout from "@/components/layout/StaticLayout";
import type { NextPageWithLayout } from "./_app";
import { Prisma } from "@prisma/client";

const CompleteRegistration: NextPageWithLayout = () => {
  const { register, handleSubmit } = useForm<Prisma.ProfileCreateInput>({
    defaultValues: {
      fullName: "",
      phone: "",
      designation: "",
    },
  });
  return (
    <>
      <Head>
        <title>Complete Registration | Top Ten Agro Chemicals</title>
        <meta
          name="description"
          content="Complete your registration on Top Ten Agro Chemicals"
        />
      </Head>
      <main></main>
    </>
  );
};

CompleteRegistration.getLayout = (page) => <StaticLayout>{page}</StaticLayout>;

export default CompleteRegistration;
