import styles from "@/styles/dashboard/user.module.css";
import { trpc, type RouterOutputs } from "@/utils/trpc";
import { formatRole } from "@/utils/formatStrings";
import { Listbox, Transition } from "@headlessui/react";
import { USER_ROLE } from "@prisma/client";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIsMutating } from "@tanstack/react-query";
import type { NextPageWithLayout } from "@/pages/_app";

// components and images imports
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import DashboardLayout from "@/components/layout/DashboardLayout";

const User: NextPageWithLayout = () => {
  // userId
  const router = useRouter();
  const id = router.query.id as string;

  // session
  const session = useSession();

  // trpc
  const utils = trpc.useContext();
  const {
    data: user,
    status,
    error,
    refetch,
  } = trpc.user.findUserById.useQuery({ id });
  // update user's role
  const [selectedRole, setSelectedRole] = useState(user?.role as USER_ROLE);
  useEffect(() => {
    if (!user) return;
    setSelectedRole(user.role);
  }, [user]);
  const { mutateAsync: updateRole, status: roleStatus } =
    trpc.users.updateRole.useMutation({
      onSuccess: async (user) => {
        setSelectedRole(user.role);
        refetch();
        roleStatus === "success" &&
          toast.success("User role updated!", { toastId: "editRoleSuccess" });
      },
      onError: async (e) => {
        toast.error(e.message, { toastId: "editRoleError" });
      },
    });
  // update user's status
  const { mutateAsync: updateStatus, status: activeStatus } =
    trpc.users.updateStatus.useMutation({
      onMutate: async ({ id }) => {
        if (session.data?.user?.id === id) {
          return toast.error(`You can't activate yourself!`, {
            toastId: "toggleUserSessionError",
          });
        }
        toast.success("User status updated!", { toastId: "toggleUserSuccess" });
      },
      onError: async (e) => {
        toast.error(e.message, { toastId: "toggleUserError" });
      },
    });
  // delete user
  const { mutateAsync: deleteUser } = trpc.users.delete.useMutation({
    onMutate: async () => {
      toast.success("User deleted!", { toastId: "deleteUserSuccess" });
    },
    onError: async (e) => {
      toast.error(e.message, { toastId: "deleteUserError" });
    },
  });
  // refetch user onMutate
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.user.findUserById.invalidate();
    }
  }, [number, refetch, utils]);

  // conditional renders
  if (status === "loading") {
    return <Loader className="min-h-screen container-res" />;
  }

  if (status === "error") {
    return (
      <div className="grid min-h-screen place-items-center text-base container-res md:text-lg">
        {`${error.message} | ${error.data?.httpStatus}`}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User | Top Ten Agro Chemicals</title>
      </Head>
      <main className={styles.wrapper}>
        {user ? (
          <div className="grid gap-10">
            <UserDetails user={user} />
            <div className="items-center justify-center">
              <p className={styles.richTitle}>Edit user</p>
              <div className="mt-2 flex items-center gap-2.5">
                <Listbox
                  as="div"
                  className="w-48"
                  value={selectedRole ?? ""}
                  onChange={(role: USER_ROLE) => {
                    setSelectedRole(role);
                    updateRole({ id, role });
                  }}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className={styles.selectButton}>
                      <span className="block truncate">
                        {roleStatus === "loading"
                          ? "Loading..."
                          : selectedRole && formatRole(selectedRole)}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className={styles.options}>
                        {Object.values(USER_ROLE).map((role, i) => (
                          <Listbox.Option
                            key={i}
                            className={({ active }) =>
                              `${styles.option} ${
                                active
                                  ? "bg-amber-100 text-amber-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={role}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {formatRole(role)}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <Button
                  aria-label={`update user's active status`}
                  intent="primary"
                  onClick={() => updateStatus({ id, active: user.active })}
                >
                  {activeStatus === "loading"
                    ? "Loading..."
                    : user.active
                    ? "Inactive"
                    : "Active"}
                </Button>
                <Button
                  aria-label={`delete user`}
                  intent="primary"
                  onClick={() => deleteUser(id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-neutral-700 md:text-base">
            No user with this id
          </p>
        )}
      </main>
    </>
  );
};

User.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default User;

// UserDetials
const UserDetails = ({
  user,
}: {
  user: RouterOutputs["user"]["findUserById"];
}) => {
  const currentUser = [
    {
      head: "User information",
      body: [
        { key: "Name", value: user?.name },
        { key: "Email", value: user?.email },
        {
          key: "Role",
          value: formatRole(user?.role),
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
    <div className="flex flex-wrap justify-between gap-5 pt-5">
      {currentUser.map((userItem, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <p className={styles.richTitle}>{userItem.head}</p>
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
      ))}
    </div>
  );
};
