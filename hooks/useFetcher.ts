"use client"
import { getSession } from "next-auth/react";

export const useFetcher = async (url: string, options?: RequestInit) => {
  if (!url) return Promise.resolve(null);
  const session = await getSession();
  return new Promise((resolve, reject) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin${url}`, {
      ...options,
      credentials: "include",
      headers : {
        "Authorization" : `Bearer ${session?.accessToken}`,
        "Content-Type" : "application/json"
      }
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            if (!res.ok) {
              console.log("Error in fetch - ",res.statusText)
              reject(data.message || "Some unknown error occurred");
            } else {
              resolve(data)
            }
          })
          .catch(() => {
            reject(res.statusText);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
