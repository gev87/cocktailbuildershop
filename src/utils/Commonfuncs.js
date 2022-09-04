import { readOnValue } from "../firebase/crudoperations";

export const calcItemQty = (currentUser) => {
  return () =>
    readOnValue(
      `users/${currentUser.uid}/orders`,
      (value) =>
        value &&
        Object.entries(value).reduce((prev, curr) => prev + curr[1].quantity, 0)
    );
};
