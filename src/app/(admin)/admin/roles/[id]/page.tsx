"use client";
import { RoleDetail } from "@/features/admin/pages/user-management/role/role-detail";
import { use } from "react";

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <RoleDetail roleId={id} />;
}
