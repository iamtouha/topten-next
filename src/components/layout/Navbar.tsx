import { useState, useEffect } from "react";
import styles from "@/styles/layout/navbar.module.css";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

// components and media imports
import Button from "../Button";
import {
  Bars3Icon,
  CodeBracketIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const desktopLinks = [
  { label: "Home", url: "/" },
  { label: "Stores", url: "/stores" },
  { label: "About", url: "/about" },
  { label: "Playground", url: "/playground" },
];

const mobileLinks = [
  { label: "Home", url: "/" },
  { label: "Stores", url: "/stores" },
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

  // Configure activeClass on active link
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
            width={160}
            height={60}
            alt={"Top Ten logo"}
            className={styles.logo}
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
            <Button
              intent="primary"
              onClick={session ? () => signOut() : () => signIn()}
            >
              {session
                ? "Sign out"
                : status === "loading"
                ? "Loading..."
                : "Sign in"}
            </Button>
          </div>
          <button
            aria-label="toggle mobile-menu"
            onClick={() => setIsMobile(!isMobile)}
          >
            {isMobile ? (
              <XMarkIcon aria-hidden="true" className={styles.mobileButton} />
            ) : (
              <Bars3Icon
                aria-hidden="true"
                className={styles.mobileButton}
                onClick={() => setIsMobile(!isMobile)}
              />
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
        className={styles.link}
        onClick={session ? () => signOut() : () => signIn()}
      >
        {session ? "Sign out" : status === "loading" ? "Loading..." : "Sign in"}
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
