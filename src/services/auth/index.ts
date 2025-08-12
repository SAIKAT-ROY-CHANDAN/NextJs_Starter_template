"use server";

import { apiRequest } from "@/lib/apiRequest";
import { TCustomJwtPayload } from "@/types/auth.types";
import { TQuery } from "@/types/query.types";
import { jwtDecode } from "jwt-decode";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const loggedUser = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;

  let decoded: TCustomJwtPayload | null = null;

  if (accessToken) {
    decoded = jwtDecode<TCustomJwtPayload>(accessToken);
  }

  return decoded;
};

export const register = async (data: FormData) => {
  const response = await apiRequest(`auth/register`, {
    method: "POST",
    body: data as FormData,
    authRequired: true,
  });

  [
    "/",
    "/dashboard/admin-user",
    "/dashboard/profile",
    "/dashboard/role",
  ].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const login = async (data: FieldValues) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (result.statusCode === 200) {
      const cookie = await cookies();

      cookie.set("accessToken", result.data.accessToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      cookie.set("refreshToken", result.data.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed. Please try again.");
  }
};

export const logout = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("accessToken");
    cookie.delete("refreshToken");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed. Please try again.");
  }
};

export const getAdminDetails = async () => {
  const response = await apiRequest(`auth/me`, {
    authRequired: true,
    method: "GET",
  });

  return response.data;
};

export const forgetPassword = async (data: FieldValues) => {
  const response = await apiRequest("auth/forget-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response;
};

export const changePassword = async (data: FieldValues) => {
  const response = await apiRequest("auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
    authRequired: true,
  });

  return await response;
};

export const getAdminUsers = async (query: TQuery[]) => {
  const params = new URLSearchParams();

  if (query && query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }

  const response = await apiRequest(`auth/admin-users?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });

  return response;
};

export const resetPassword = async (data: FieldValues) => {
  const response = await apiRequest("auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
};

export const updateProfile = async (data: FormData) => {
  const response = await apiRequest(`auth/update-profile`, {
    method: "PUT",
    body: data as FormData,
    authRequired: true,
  });

  revalidatePath("/dashboard/profile");

  return await response;
};

export const updateAdminUserStatus = async (id: string) => {
  const response = await apiRequest(`auth/admin-users/${id}/status`, {
    method: "PUT",
    authRequired: true,
  });

  revalidatePath("/dashboard/admin-user");

  return await response;
};

export const deleteAdminUser = async (id: string | undefined) => {
  const response = await apiRequest(`auth/admin-users/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  revalidatePath("/dashboard/admin-user");

  return await response;
};
