"use client";
import { useEffect, useState } from "react";

export function useStats() {
  const [stats, setStats] = useState({ users: 0, sales: 0 });

  useEffect(() => {
    setStats({ users: 42, sales: 99 }); // mock
  }, []);

  return { stats };
}
