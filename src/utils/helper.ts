import { isNil, mapValues } from "lodash";

export const nullToString = (obj: object | undefined | null) => {
  if (typeof obj === "undefined" || obj === null) {
    return {};
  }
  return mapValues(obj, (v) => (isNil(v) ? "" : v));
};
