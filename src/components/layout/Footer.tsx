import React from "react";
import styles from "@/styles/layout/footer.module.css";
import dayjs from "dayjs";

const Footer = () => {
  return (
    <footer aria-label="footer" className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <h1 className={styles.title}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </h1>
          <p className={styles.description}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className={styles.copyright}>
            Copyright &#169; {dayjs().format("YYYY")} Topten
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
