import React from "react";
import styles from "@/styles/layout/footer.module.css";
import Image from "next/image";
import dayjs from "dayjs";

const Footer = () => {
  return (
    <footer aria-label="footer" className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <Image
            src={"/img/logo.png"}
            width={125}
            height={47}
            alt={"Top Ten logo"}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>Agro chemicals service for your farm</h1>
          <p className={styles.copyright}>
            Copyright &#169; {dayjs().format("YYYY")} Top Ten Agro Chemicals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
