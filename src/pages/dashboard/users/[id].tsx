import type { NextPageWithLayout } from "@/pages/_app";
import { api, type RouterOutputs } from "@/utils/api";
import { titleCase } from "@/utils/format";
import { Listbox, Transition } from "@headlessui/react";
import { User, USER_ROLE } from "@prisma/client";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// components imports
import Button from "@/components/Button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Searchbar from "@/components/Searchbar";

// icons imports
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const User: NextPageWithLayout = () => {
  const id = Router.query.id as string;
  const session = useSession();

  // trpc
  const utils = api.useContext();
  const { data: user, status, error } = api.admin.users.getOne.useQuery(id);
  // update user role
  const [selectedRole, setSelectedRole] = useState<USER_ROLE>(
    user?.role as USER_ROLE
  );
  useMemo(() => {
    setSelectedRole(user?.role as USER_ROLE);
  }, [user?.role]);
  const { mutate: updateRole, status: roleStatus } =
    api.admin.users.updateRole.useMutation({
      onSuccess: (user) => {
        void setSelectedRole(user.role);
        void toast.success("User role updated!");
      },
      onError: (e) => {
        void toast.error(e.message, { toastId: "editRoleError" });
      },
    });
  // update user status
  const { mutate: updateStatus, status: activeStatus } =
    api.admin.users.updateStatus.useMutation({
      onSuccess: () => {
        toast.success("User status updated!");
      },
      onError: (e) => {
        toast.error(e.message, { toastId: "toggleUserError" });
      },
    });
  // delete user
  const { mutate: deleteUser } = api.admin.users.delete.useMutation({
    onSuccess: async () => {
      await Router.push("/dashboard/users");
      void toast.success("User deleted!", { toastId: "deleteUserSuccess" });
    },
    onError: (e) => {
      toast.error(e.message, { toastId: "deleteUserError" });
    },
  });
  // get all users
  const { data } = api.admin.users.get.useQuery({
    sortBy: "createdAt",
    sortDesc: true,
  });
  // refetch
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      void utils.admin.users.getOne.invalidate(id);
      void utils.admin.users.get.invalidate();
    }
  }, [id, number, utils]);

  return (
    <>
      <Head>
        <title>Update User | Top Ten Agro Chemicals</title>
      </Head>
      <main className="container min-h-screen max-w-screen-sm pt-5 pb-10">
        {status === "loading" ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            Loading...
          </div>
        ) : status === "error" ? (
          <div
            role="status"
            className="text-sm font-medium text-title md:text-base"
          >
            {`${error.message} | ${error.data?.httpStatus ?? ""}`}
          </div>
        ) : (
          <div className="grid gap-8">
            {data?.users ? (
              <Searchbar<User> data={data.users} route="users" />
            ) : null}
            <div className="grid gap-4">
              <Listbox
                aria-label="update user role"
                as="div"
                value={selectedRole ?? ""}
                onChange={(role: USER_ROLE) => {
                  setSelectedRole(role);
                  updateRole({ id, role });
                }}
                disabled={session.data?.user?.id === id || !user.active}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className="relative w-full cursor-pointer bg-white py-2 pl-3 pr-10 text-left text-xs font-medium ring-1 ring-lowkey transition
                      focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300
                      enabled:hover:bg-layout disabled:cursor-not-allowed md:text-sm
                    "
                  >
                    <span className="block truncate">
                      {roleStatus === "loading"
                        ? "Loading..."
                        : selectedRole
                        ? titleCase(selectedRole)
                        : "-"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-neutral-400"
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
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:text-sm">
                      {Object.values(USER_ROLE).map((role) => (
                        <Listbox.Option
                          key={role}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-title"
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
                                {titleCase(role)}
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
              <div className="flex flex-col items-center justify-between gap-5 xs:flex-row">
                <Button
                  aria-label="update user status"
                  className={`w-full ${
                    user.active ? "bg-red-500" : "bg--primary-700"
                  }`}
                  onClick={() => updateStatus({ id, active: !user.active })}
                  disabled={session.data?.user?.id === id}
                >
                  {activeStatus === "loading"
                    ? "Loading..."
                    : user.active
                    ? "Deactivate"
                    : "Activate"}
                </Button>
                <Button
                  aria-label="delete user"
                  className="w-full bg-red-100 text-red-500"
                  onClick={() => deleteUser(id)}
                  disabled={session.data?.user?.id === id}
                >
                  Delete
                </Button>
              </div>
            </div>

            <UserDetails user={user} />
          </div>
        )}
      </main>
    </>
  );
};

User.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default User;

// UserDetails
const UserDetails = ({
  user,
}: {
  user: RouterOutputs["admin"]["users"]["getOne"];
}) => {
  const currentUser = [
    {
      head: "User",
      body: [
        { key: "Name", value: user?.name },
        { key: "Email", value: user?.email },
        {
          key: "Role",
          value: titleCase(user?.role),
        },
        {
          key: "Created at",
          value: dayjs(user?.createdAt).format("DD/MM/YYYY, hh:mmA"),
        },
        { key: "Status", value: user?.active ? "Active" : "Inactive" },
      ],
    },
    {
      head: "Profile",
      body: [
        { key: "Full name", value: user?.profile?.fullName },
        { key: "Phone number", value: user?.profile?.phone },
        {
          key: "Designation",
          value: user?.profile?.designation,
        },
        {
          key: "Created at",
          value: dayjs(user?.profile?.createdAt).format("DD/MM/YYYY, hh:mm a"),
        },
        {
          key: "Updated at",
          value: dayjs(user?.profile?.updatedAt).format("DD/MM/YYYY, hh:mm a"),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap justify-between gap-5">
      {currentUser.map((userItem, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <p className="text-base font-semibold text-title md:text-lg">
            {userItem.head}
          </p>
          <>
            {userItem.body.map((userbody, j) => (
              <div key={j} className="flex gap-2">
                <p className="text-sm font-medium text-title md:text-base">
                  {userbody.key}:
                </p>
                <p className="text-sm text-title md:text-base">
                  {userbody.value ?? "-"}
                </p>
              </div>
            ))}
          </>
        </div>
      ))}
    </div>
  );
};
