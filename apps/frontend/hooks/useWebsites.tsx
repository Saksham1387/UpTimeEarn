"use client";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

interface Website {
  id: string;
  url: string;
  ticks: Tick[];
}

interface Tick {
  id: string;
  createdAt: string;
  status: string;
  latency: number;
}
export function useWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);

  const getWebsites = async () => {
    const token = await getToken();
    const res = await axios.get(`${BACKEND_URL}/api/v1/website`, {
      headers: {
        Authorization: token,
      },
    });
    setWebsites(res.data.data);
  };

  useEffect(() => {
    getWebsites();
    const interval = setInterval(
      () => {
        getWebsites();
      },
      1000 * 60 * 1
    );
    return () => clearInterval(interval);
  }, []);

  return  {websites, getWebsites};
}
