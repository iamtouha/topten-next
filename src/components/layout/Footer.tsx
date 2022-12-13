import React from "react";
import dayjs from "dayjs";

const Footer = () => {
  return (
    <footer aria-label="footer" className="bg-layout">
      <div className="mx-auto w-[89vw] max-w-7xl py-14">
        <div className="mx-auto grid place-items-center gap-2">
          <h1 className="text-xl font-medium text-title md:text-2xl">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </h1>
          <p className="text-xs text-content md:text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-xs text-content md:text-sm">
            Copyright &#169; {dayjs().format("YYYY")} Topten
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
