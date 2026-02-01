"use client";
import { RoleDetail } from "@/features/role/components/admin/role-detail";
import { use } from "react";

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <RoleDetail roleId={id} />;
}
