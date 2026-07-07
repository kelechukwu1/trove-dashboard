import { simulateDelay } from "@/utils/portfolio.helpers";

export const login = async (email: string) => {
  await simulateDelay(); // Simulated API call
  return email;
};
