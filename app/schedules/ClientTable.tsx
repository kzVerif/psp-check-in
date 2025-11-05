"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ISchedules } from "@/actions/schedules";

export default function ClientTable({ data }: { data: ISchedules[] }) {
  return <DataTable columns={columns} data={data} />;
}
