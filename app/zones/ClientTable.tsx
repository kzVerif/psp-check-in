"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { zoneTable } from "@/actions/zones";

export default function ClientTable({ data }: { data: zoneTable[] }) {
  return <DataTable columns={columns} data={data} />;
}
