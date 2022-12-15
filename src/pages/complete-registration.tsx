import Head from "next/head";
import Router from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import StaticLayout from "@/components/layout/StaticLayout";
import type { NextPageWithLayout } from "./_app";
import styles from "@/styles/completeregistration.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

type InputFields = {
  fullName: string;
  phone: string;
  designation: string;
};

const schema = z.object({
  fullName: z.string().min(5).max(32),
  phone: z.string().min(11).max(15),
  designation: z.string().min(4),
});

const CompleteRegistration: NextPageWithLayout = () => {
  const { data: session, status } = useSession({ required: true });
  const { register, handleSubmit, formState } = useForm<InputFields>({
    defaultValues: {
      fullName: "",
      phone: "",
      designation: "",
    },
    resolver: zodResolver(schema),
  });
  const createProfileMutation = trpc.user.createProfile.useMutation({
    onSuccess: () => {
      toast.success("Registration completed!");
      location.reload();
    },
    onError: () => {
      toast.error("An Error occured!");
    },
  });

  useEffect(() => {
    if (session?.user?.profileId) {
      Router.push("/app");
    }
  }, [session?.user?.profileId]);

  const onSubmit = (data: InputFields) => {
    createProfileMutation.mutate({ ...data });
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
        <div className="container mx-auto sm:max-w-screen-sm">
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
                {`Full name ( পূর্ণ নাম )`}
              </label>
              <input
                type="text"
                className={styles.input}
                id="complete_registration_fullName"
                placeholder="Full name"
                {...register("fullName", { required: true })}
              />
              {formState.errors.fullName ? (
                <p className="text-sm text-danger">
                  {formState.errors.fullName.message}
                </p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="complete_registration_phone"
                className={styles.inputLabel}
              >
                {`Phone No. ( ফোন নম্বর )`}
              </label>
              <input
                type="text"
                id="complete_registration_phone"
                className={styles.input}
                placeholder="Phone number"
                {...register("phone", { required: true })}
              />
              {formState.errors.phone ? (
                <p className="text-sm text-danger">
                  {formState.errors.phone.message}
                </p>
              ) : null}
            </div>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="complete_registration_designation"
                className={styles.inputLabel}
              >
                {"Designation ( পদবী )"}
              </label>
              <input
                type="text"
                id="complete_registration_designation"
                className={styles.input}
                placeholder="Designation"
                {...register("designation", { required: true })}
              />
              {formState.errors.designation ? (
                <p className="text-sm text-danger">
                  {formState.errors.designation.message}
                </p>
              ) : null}
            </div>
            <button
              className={styles.button}
              disabled={createProfileMutation.isLoading}
            >
              {createProfileMutation.isLoading ? "loading" : "Register"}
            </button>
          </form>
          <p className={styles.baseText}>
            Don&apos;t have an account?{" "}
            <Link href="/api/auth/signin">
              <span className={styles.richText}>Sign up</span>
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

CompleteRegistration.getLayout = (page) => <StaticLayout>{page}</StaticLayout>;

export default CompleteRegistration;
