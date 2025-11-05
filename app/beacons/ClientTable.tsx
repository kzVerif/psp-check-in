"use client";

import { DataTable } from "./data-table";
import { columns, Beacons } from "./columns";

export default function ClientTable({ data }: { data: Beacons[] }) {
  return <DataTable columns={columns} data={data} />;
}
