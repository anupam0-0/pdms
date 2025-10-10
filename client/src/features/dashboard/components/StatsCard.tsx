"use client";
import { useStats } from "../hooks/useStats";

export default function StatsCard() {
  const { stats } = useStats();

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="font-semibold">Stats</h2>
      <p>Users: {stats.users}</p>
      <p>Sales: {stats.sales}</p>
    </div>
  );
}
