import styles from "@/styles/completeregistration.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import type { NextPageWithLayout } from "./_app";

// components imports
import StaticLayout from "@/components/layouts/StaticLayout";
import Button from "@/components/ui/Button";
import { api } from "@/utils/api";

const schema = z.object({
  fullName: z
    .string()
    .min(5, { message: "Full name must be at least 5 characters" })
    .max(32, { message: "Full name must be at most 32 characters" }),
  phone: z
    .string()
    .min(11, { message: "Phone number must be at least 11 characters" })
    .max(15, { message: "Phone number must be at most 15 characters" }),
  designation: z
    .string()
    .min(4, { message: "Designation must be at least 4 characters" }),
});
type Inputs = z.infer<typeof schema>;

const CompleteRegistration: NextPageWithLayout = () => {
  const { data: session } = useSession({ required: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      fullName: "",
      phone: "",
      designation: "",
    },
    resolver: zodResolver(schema),
  });

  const createProfileMutation = api.user.createProfile.useMutation({
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
      void Router.push("/app");
    }
  }, [session?.user?.profileId]);

  const onSubmit = (data: Inputs) => {
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
      <main className="container-res max-w-screen-sm py-5">
        <h1 className={styles.formTitle}>Complete registration</h1>
        <form
          aria-label="create-profile form"
          className={styles.form}
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          <div className={styles.inputWrapper}>
            <label
              htmlFor="create_profile_fullName"
              className={styles.inputLabel}
            >
              {`Full name ( পূর্ণ নাম )`}
            </label>
            <input
              type="text"
              id="create_profile_fullName"
              className={styles.input}
              placeholder="Full name"
              {...register("fullName", { required: true })}
            />
            {errors.fullName ? (
              <p className="text-sm font-medium text-danger">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="create_profile_phone" className={styles.inputLabel}>
              {`Phone number ( ফোন নম্বর )`}
            </label>
            <input
              type="text"
              id="create_profile_phone"
              className={styles.input}
              placeholder="Phone number"
              {...register("phone", { required: true })}
            />
            {errors.phone ? (
              <p className="text-sm font-medium text-danger">
                {errors.phone.message}
              </p>
            ) : null}
          </div>
          <div className={styles.inputWrapper}>
            <label
              htmlFor="create_profile_designation"
              className={styles.inputLabel}
            >
              {"Designation ( পদবী )"}
            </label>
            <input
              type="text"
              id="create_profile_designation"
              className={styles.input}
              placeholder="Designation"
              {...register("designation", { required: true })}
            />
            {errors.designation ? (
              <p className="text-sm font-medium text-danger">
                {errors.designation.message}
              </p>
            ) : null}
          </div>
          <Button
            className="mt-2.5 w-full bg-primary-700 py-3"
            disabled={createProfileMutation.isLoading}
          >
            {createProfileMutation.isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
        <p className={styles.baseText}>
          {`Don't have an account? `}
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
