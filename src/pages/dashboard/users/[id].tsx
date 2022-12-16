import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";

// components imports
import Loader from "@/components/Loader";

const User: NextPage = () => {
  // userId
  const id = useRouter().query.id as string;

  // trpc
  const { data: user, status } = trpc.user.findUserById.useQuery({ id });

  if (status === "loading") {
    return <Loader className="min-h-screen container-res" />;
  }

  const currentUser = [
    {
      head: "User information",
      body: [
        { key: "Name", value: user?.name },
        { key: "Email", value: user?.email },
        {
          key: "Role",
          value: ((user?.role
            .replace(/_/g, " ")
            .charAt(0)
            .toUpperCase() as string) +
            user?.role.replace(/_/g, " ").slice(1).toLowerCase()) as string,
        },
        {
          key: "Created at",
          value: dayjs(user?.createdAt).format("DD/MM/YYYY, hh:mmA"),
        },
        { key: "Status", value: user?.active ? "Active" : "Inactive" },
      ],
    },
    {
      head: "User profile",
      body: [
        { key: "Full name", value: user?.profile?.fullName },
        { key: "Phone number", value: user?.profile?.phone },
        {
          key: "Designation",
          value: user?.profile?.designation,
        },
        {
          key: "Created at",
          value: dayjs(user?.profile?.createdAt).format("DD/MM/YYYY, hh:mmA"),
        },
        {
          key: "Updated at",
          value: dayjs(user?.profile?.updatedAt).format("DD/MM/YYYY, hh:mmA"),
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>User | Top Ten Agro Chemicals</title>
      </Head>
      <main className="min-h-screen max-w-screen-sm container-res">
        <div className="flex flex-wrap justify-between gap-5 pt-5">
          {user ? (
            currentUser.map((userItem, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <h1 className="text-base font-medium text-success md:text-lg">
                  {userItem.head}
                </h1>
                <>
                  {userItem.body.map((userbody, j) => (
                    <div key={j} className="flex gap-2">
                      <p className="text-sm font-medium md:text-base">
                        {userbody.key}:
                      </p>
                      <p className="text-sm text-neutral-900 md:text-base">
                        {userbody.value}
                      </p>
                    </div>
                  ))}
                </>
              </div>
            ))
          ) : (
            <p className="text-sm font-medium text-neutral-700 md:text-base">
              No user found
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default User;
