/* eslint-disable @typescript-eslint/no-explicit-any */
export const safeParseJSON = (data: any) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return null;
  }
};