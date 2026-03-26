import { envVars } from "../../config/env";

export const getUploadUrl = (file?: string) => {
  if (!file) return null;
  return `${envVars.BETTER_AUTH_URL}/uploads/${file}`;
};