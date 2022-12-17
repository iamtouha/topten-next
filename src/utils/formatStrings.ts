export const formatRole = (str: string) => {
  return ((str.replace(/_/g, " ").charAt(0).toUpperCase() as string) +
    str.replace(/_/g, " ").slice(1).toLowerCase()) as string;
};
