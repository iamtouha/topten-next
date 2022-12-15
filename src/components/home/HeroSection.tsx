import Image from "next/image";
import React from "react";

// components imports
import Button from "../Button";

const HeroSection = () => {
  return (
    <section aria-label="hero section">
      <div className="flex flex-col-reverse items-center justify-between gap-10 py-5 container-res lg:flex-row lg:gap-28">
        <div className="grid flex-[0.4] gap-2">
          <h1 className="text-3xl font-bold text-black md:text-4xl">
            Buy agro chemicals for the better utilization of your farm
          </h1>
          <p className="mb-2 text-sm text-description md:text-base">
            A convenient service for your agro needs
          </p>
          <Button intent="primary">Explore</Button>
        </div>
        <Image
          src={"/img/hero-section.webp"}
          alt="hero"
          width={560}
          height={315.0}
          priority
          className="aspect-video w-full flex-[0.6]"
        />
      </div>
    </section>
  );
};

export default HeroSection;
