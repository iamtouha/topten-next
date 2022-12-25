export const formatRole = (role: string) => {
  return (
    role.replace(/_/g, " ").charAt(0).toUpperCase() +
    role.replace(/_/g, " ").slice(1).toLowerCase()
  );
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: "BDT",
  }).format(price);
};
