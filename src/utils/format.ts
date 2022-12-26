export const titleCase = (string: string) => {
  return (
    string.replace(/_/g, " ").charAt(0).toUpperCase() +
    string.replace(/_/g, " ").slice(1).toLowerCase()
  );
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: "BDT",
  }).format(price);
};
