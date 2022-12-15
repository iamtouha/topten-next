import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import StaticLayout from "@/components/layout/StaticLayout";
import type { NextPageWithLayout } from "./_app";
import type { Prisma } from "@prisma/client";
import styles from "@/styles/completeregistration.module.css";
import Link from "next/link";

const CompleteRegistration: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<Prisma.ProfileCreateInput>({
    defaultValues: {
      fullName: "",
      phone: "",
      designation: "",
    },
  });
  const onSubmit: SubmitHandler<Prisma.ProfileCreateInput> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Complete Registration | Top Ten Agro Chemicals</title>
        <meta
          name="description"
          content="Complete your registration on Top Ten Agro Chemicals"
        />
      </Head>
      <main className="py-5 container-res">
        <h1 className={styles.formTitle}>Complete registration</h1>
        <form
          aria-label="complete-registration form"
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.inputWrapper}>
            <label
              htmlFor="complete_registration_fullName"
              className={styles.inputLabel}
            >
              Full name
            </label>
            <input
              type="text"
              id="complete_registration_fullName"
              className={styles.input}
              placeholder="Full name"
              {...register("fullName", { required: true })}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label
              htmlFor="complete_registration_phone"
              className={styles.inputLabel}
            >
              Phone
            </label>
            <input
              type="text"
              id="complete_registration_phone"
              className={styles.input}
              placeholder="Phone number"
              {...register("phone", { required: true })}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label
              htmlFor="complete_registration_designation"
              className={styles.inputLabel}
            >
              Designation
            </label>
            <input
              type="text"
              id="complete_registration_designation"
              className={styles.input}
              placeholder="Designation"
              {...register("designation", { required: true })}
            />
          </div>
          <button className={styles.button}>Register</button>
        </form>
        <p className={styles.baseText}>
          Don&apos;t have an account?{" "}
          <Link href="/api/auth/signin">
            <span className={styles.richText}>Sign up</span>
          </Link>
        </p>
      </main>
    </>
  );
};

CompleteRegistration.getLayout = (page) => <StaticLayout>{page}</StaticLayout>;

export default CompleteRegistration;
