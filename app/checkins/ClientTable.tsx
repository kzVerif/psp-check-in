"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ICheckins } from "@/actions/checkins";

export default function ClientTable({ data }: { data: ICheckins[] }) {
  return <DataTable columns={columns} data={data} />;
}
