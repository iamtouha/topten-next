import Button from "@/components/ui/Button";
import styles from "@/styles/header.module.css";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { USER_ROLE } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, type NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const desktopLinks = [
  { label: "Home", url: "/" },
  { label: "Stores", url: "/app/stores" },
  { label: "About", url: "/about" },
];

const mobileLinks = [
  { label: "Home", url: "/" },
  { label: "Stores", url: "/app/stores" },
  { label: "About", url: "/about" },
];

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // change nav background onScroll
  useEffect(() => {
    const changeBg = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    };
    window.addEventListener("scroll", changeBg);
    return () => window.removeEventListener("scroll", changeBg);
  }, []);

  // stop overflowY when mobile-menu is opened
  useEffect(() => {
    const body = document.querySelector("body");
    const stopOverflowY = styles.stopOverflowY as string;

    isMobile
      ? body?.classList.add(stopOverflowY)
      : body?.classList.remove(stopOverflowY);
    return () => body?.classList.remove(stopOverflowY);
  }, [isMobile]);

  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <header
      aria-label="navbar"
      className={twMerge(
        styles.navbar,
        isMobile ? styles.navbarMobile : "",
        isScrolled ? styles.navbarScrolled : ""
      )}
    >
      <div className={styles.wrapper}>
        <Link href={"/"} onClick={() => setIsMobile(false)}>
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
        {session?.user?.role === USER_ROLE.ADMIN ||
        session?.user?.role === USER_ROLE.SUPER_ADMIN ? (
          <Link
            href={"/dashboard"}
            className={twMerge(
              router.pathname.startsWith("/dashboard") ? styles.activeLink : "",
              styles.link,
              "mr-6 ml-auto"
            )}
          >
            {"Dashboard"}
          </Link>
        ) : null}
        <div className={styles.endColumn}>
          <div className={styles.authButtonWrapper}>
            {session ? (
              <Link href={"/app/account"}>
                <Image
                  src={session.user?.image as string}
                  alt={session.user?.name as string}
                  width={48}
                  height={48}
                  className={twMerge(
                    styles.avatar,
                    router.pathname === "/app/account" &&
                      "ring-2 ring-primary-700",
                    "cursor-pointer rounded-full transition-opacity hover:opacity-80 active:opacity-100"
                  )}
                  loading="lazy"
                />
              </Link>
            ) : (
              <Link href={"/api/auth/signin"}>
                <Button
                  aria-label="sign in"
                  className="whitespace-nowrap bg-primary-700"
                >
                  {status === "loading" ? "Loading..." : "Sign in"}
                </Button>
              </Link>
            )}
          </div>
          <button
            aria-label="toggle mobile-menu"
            aria-pressed={isMobile}
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
    </header>
  );
};

export default Header;

type MobileLinksProps = {
  router: NextRouter;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileLinks = ({ router, isMobile, setIsMobile }: MobileLinksProps) => {
  const { data: session, status } = useSession();

  return (
    <ul
      className={twMerge(
        styles.links,
        styles.mobileLinks,
        isMobile ? styles.mobileLinksActive : ""
      )}
    >
      {mobileLinks.map((navLink, i) => {
        return (
          <li key={i} onClick={() => setIsMobile(false)}>
            <Link
              href={navLink.url}
              className={twMerge(
                styles.link,
                router.pathname === navLink.url ? styles.activeLink : ""
              )}
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
        onClick={() => setIsMobile(false)}
      >
        <Link href={session ? "/app/account" : "/api/auth/signin"}>
          {session
            ? "Account"
            : status === "loading"
            ? "Loading..."
            : "Sign in"}
        </Link>
      </li>
    </ul>
  );
};

const DesktopLinks = ({ router }: { router: NextRouter }) => {
  return (
    <ul className={twMerge(styles.links, styles.desktopLinks)}>
      {desktopLinks.map((navLink, i) => {
        return (
          <li key={i}>
            <Link
              href={navLink.url}
              className={twMerge(
                styles.link,
                router.pathname === navLink.url ? styles.activeLink : ""
              )}
            >
              {navLink.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
