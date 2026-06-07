import type { AuthProvider } from "react-admin";
import { supabaseClient } from "../config/supabaseClient";

interface LoginParams {
  username: string;
  password: string;
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }: LoginParams) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) throw new Error(error.message);
  },

  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw new Error(error.message);
  },

  checkAuth: async () => {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();

    if (error || !user) throw new Error("Session expired");
  },

  checkError: async (error: { status?: number }) => {
    if (error?.status === 401 || error?.status === 403) {
      await supabaseClient.auth.signOut();
      throw new Error("Unauthorized");
    }
  },

  getIdentity: async () => {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();

    if (error || !user) throw new Error("User not found");

    return {
      id: user.id,
      fullName: user.user_metadata?.full_name ?? user.email ?? "User",
    };
  },
};
