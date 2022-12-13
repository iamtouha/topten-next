import { useState, useEffect } from "react";
import styles from "@/styles/layout/navbar.module.css";
import Link from "next/link";
import {
  Bars3Icon,
  CodeBracketIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "../design-system/Button";

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
  { label: "Sign up", url: "/signup" },
];

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Change nav background onScroll
  const changeBg = () => {
    window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBg);
    return () => window.removeEventListener("scroll", changeBg);
  }, []);

  // Stop overflowY when navmenu is opened
  useEffect(() => {
    const body = document.querySelector("body");
    const stopOverflowY = styles.stopOverflowY as string;

    isMobile
      ? body?.classList.add(stopOverflowY)
      : body?.classList.remove(stopOverflowY);
    return () => body?.classList.remove(stopOverflowY);
  }, [isMobile]);

  return (
    <section
      aria-label="navbar"
      className={
        isScrolled
          ? `${styles.section} ${styles.sectionScrolled}`
          : styles.section
      }
    >
      <div className={styles.wrapper}>
        <Link href="/" onClick={() => setIsMobile(false)}>
          <CodeBracketIcon className="aspect-square w-5 text-title" />
        </Link>
        <MobileLinks isMobile={isMobile} setIsMobile={setIsMobile} />
        <DesktopLinks />
        <div className={styles.right}>
          <Link
            href="/signup"
            aria-label="sign up"
            className={styles.signupButtonWrapper}
          >
            <Button intent="primary" text="Sign up" />
          </Link>
          {isMobile ? (
            <XMarkIcon
              className={styles.mobileButton}
              aria-hidden="true"
              onClick={() => setIsMobile(!isMobile)}
            />
          ) : (
            <Bars3Icon
              className={styles.mobileButton}
              aria-hidden="true"
              onClick={() => setIsMobile(!isMobile)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Navbar;

type MobileLinksProps = {
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileLinks = ({ isMobile, setIsMobile }: MobileLinksProps) => {
  return (
    <ul
      className={`${styles.links} ${styles.mobileLinks} ${
        isMobile ? styles.mobileLinksActive : ""
      }`}
    >
      {mobileLinks.map((navLink, i) => {
        return (
          <li key={i} onClick={() => setIsMobile(false)}>
            <Link className={styles.link} href={navLink.url}>
              {navLink.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const DesktopLinks = () => {
  return (
    <ul className={`${styles.links} ${styles.desktopLinks}`}>
      {desktopLinks.map((navLink, i) => {
        return (
          <li key={i}>
            <Link className={styles.link} href={navLink.url}>
              {navLink.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
