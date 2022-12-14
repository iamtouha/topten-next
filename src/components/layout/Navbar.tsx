import { useState, useEffect } from "react";
import styles from "@/styles/layout/navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { type NextRouter, useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

// components imports
import Button from "../Button";

// images imports
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const desktopLinks = [
  { label: "Home", url: "/" },
  { label: "Stores", url: "/app/stores" },
  { label: "About", url: "/about" },
  { label: "Playground", url: "/playground" },
];

const mobileLinks = [
  { label: "Home", url: "/" },
  { label: "Stores", url: "/app/stores" },
  { label: "About", url: "/about" },
  { label: "Playground", url: "/playground" },
];

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Change nav background onScroll
  useEffect(() => {
    const changeBg = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    };
    window.addEventListener("scroll", changeBg);
    return () => window.removeEventListener("scroll", changeBg);
  }, []);

  // Stop overflowY when mobile-menu is opened
  useEffect(() => {
    const body = document.querySelector("body");
    const stopOverflowY = styles.stopOverflowY as string;

    isMobile
      ? body?.classList.add(stopOverflowY)
      : body?.classList.remove(stopOverflowY);
    return () => body?.classList.remove(stopOverflowY);
  }, [isMobile]);

  // Handle routes && Configure activeClass
  const router = useRouter();

  // Auth
  const { data: session, status } = useSession();

  return (
    <nav
      aria-label="navbar"
      className={
        isScrolled
          ? `${styles.section} ${styles.sectionScrolled}`
          : styles.section
      }
    >
      <div className={styles.wrapper}>
        <Link href="/" onClick={() => setIsMobile(false)}>
          <Image
            src={"/img/logo.png"}
            width={125}
            height={47}
            alt={"Top Ten logo"}
            className={styles.logo}
            priority
          />
        </Link>
        <MobileLinks
          router={router}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
        />
        <DesktopLinks router={router} />
        <div className={styles.endColumn}>
          <div className={styles.authButtonWrapper}>
            {session ? (
              <Link href="/app/account">
                <Image
                  src={session.user?.image as string}
                  alt={session.user?.name as string}
                  width={48}
                  height={48}
                  className={`${
                    router.pathname === "/app/account" &&
                    "ring-2 ring-primary-700"
                  } cursor-pointer rounded-full transition-opacity hover:opacity-80 active:opacity-100`}
                  loading="lazy"
                />
              </Link>
            ) : status === "loading" ? (
              <p className="text-sm font-medium text-neutral-700 md:text-base">
                Loading...
              </p>
            ) : (
              <Button intent="primary" onClick={() => signIn()}>
                Sign in
              </Button>
            )}
          </div>
          <button
            aria-label="toggle mobile-menu"
            onClick={() => setIsMobile(!isMobile)}
          >
            {isMobile ? (
              <XMarkIcon className={styles.mobileButton} aria-hidden="true" />
            ) : (
              <Bars3Icon className={styles.mobileButton} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

type MobileLinksProps = {
  router: NextRouter;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileLinks = ({ router, isMobile, setIsMobile }: MobileLinksProps) => {
  const { data: session, status } = useSession();

  return (
    <ul
      className={`${styles.links} ${styles.mobileLinks} ${
        isMobile ? styles.mobileLinksActive : ""
      }`}
    >
      {mobileLinks.map((navLink, i) => {
        return (
          <li key={i} onClick={() => setIsMobile(false)}>
            <Link
              href={navLink.url}
              className={
                router.pathname === navLink.url
                  ? styles.activeLink
                  : styles.link
              }
            >
              {navLink.label}
            </Link>
          </li>
        );
      })}
      <li
        className={
          router.pathname === "/app/account" ? styles.activeLink : styles.link
        }
        onClick={
          session
            ? () => router.push("/app/account").then(() => setIsMobile(false))
            : () => signIn()
        }
      >
        {session ? "Account" : status === "loading" ? "Loading..." : "Sign in"}
      </li>
    </ul>
  );
};

const DesktopLinks = ({ router }: { router: NextRouter }) => {
  return (
    <ul className={`${styles.links} ${styles.desktopLinks}`}>
      {desktopLinks.map((navLink, i) => {
        return (
          <li key={i}>
            <Link
              href={navLink.url}
              className={
                router.pathname === navLink.url
                  ? styles.activeLink
                  : styles.link
              }
            >
              {navLink.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
