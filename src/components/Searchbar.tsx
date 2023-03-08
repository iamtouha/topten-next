import styles from "@/styles/searchbar.module.css";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import type { Product, Store, User } from "@prisma/client";
import Router from "next/router";
import { Fragment, useEffect, useState } from "react";

// icons imports
import {
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

type SearchbarProps<TData> = {
  data: TData[];
  route: string;
};

const Searchbar = <TData extends User | Product | Store>({
  data,
  route,
}: SearchbarProps<TData>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // filter data
  const filteredData =
    query === ""
      ? data
      : data.filter((item) =>
          item.name
            ? item.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(query.toLowerCase().replace(/\s+/g, ""))
            : item
        );

  // handle keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen]);

  return (
    <section aria-label="search modal">
      <button
        aria-label="search"
        aria-keyshortcuts="Ctrl K"
        onClick={() => setIsOpen(true)}
        className={styles.button}
      >
        <MagnifyingGlassIcon className={styles.buttonIcon} aria-hidden="true" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={styles.dialog}
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={styles.dialogOverlay} />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className={styles.dialogPanelWrapper}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel>
                  <Combobox
                    onChange={(value: TData) => {
                      void Router.push(`/dashboard/${route}/${value.id}`);
                      void setIsOpen(false);
                    }}
                  >
                    <div className={styles.inputWrapper}>
                      <Combobox.Button className={styles.iconWrapper}>
                        <MagnifyingGlassIcon
                          className={`${styles.icon ?? ""} text-neutral-500`}
                          aria-hidden="true"
                        />
                      </Combobox.Button>
                      <Combobox.Input
                        className={styles.input}
                        placeholder={`Search ${route}...`}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setQuery("")}
                    >
                      <Combobox.Options static className={styles.options}>
                        {filteredData.length === 0 && query !== "" ? (
                          <div className={styles.optionNull}>
                            <span className={styles.optionText}>
                              No item found
                            </span>
                            <span className={styles.iconWrapper}>
                              <XMarkIcon
                                className={styles.icon}
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        ) : (
                          filteredData.map((item) => (
                            <Combobox.Option
                              key={item.id}
                              className={twMerge(
                                "ui-active:bg-primary-600 ui-active:text-white",
                                "ui-active:text-white"
                              )}
                              value={item}
                            >
                              <span className={styles.optionText}>
                                {item.name}
                              </span>
                              <span
                                className={twMerge(
                                  styles.iconWrapper,
                                  "ui-active:text-white",
                                  "text-black"
                                )}
                              >
                                <Bars3BottomLeftIcon
                                  className={styles.icon}
                                  aria-hidden="true"
                                />
                              </span>
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </Combobox>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default Searchbar;
