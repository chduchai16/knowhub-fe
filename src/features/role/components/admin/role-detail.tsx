"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CircleX, Save, Shield, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Role } from "@/features/role/models/types";
import { RoleService } from "@/features/role/services/role-service";
import { roleSchema, RoleSchema } from "@/features/role/schemas/role-schema";
import { UserAction } from "@/shared/models/user-action";

interface RoleDetailProps {
  roleId?: string;
}

export function RoleDetail({ roleId }: RoleDetailProps) {
  const isCreateMode = !roleId;
  const [role, setRole] = useState<Role | null>(null);
  const [cacheRole, setCacheRole] = useState<Role | null>(null);
  const [userAction, setUserAction] = useState<UserAction>(isCreateMode ? UserAction.CREATE : UserAction.DETAILT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const roleForm = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      id: undefined,
      name: "",
      permissionNames: [],
      createdAt: "",
      updatedAt: "",
    },
    mode: "onBlur",
  });

  // Fetch role data (only for DETAIL/UPDATE mode)
  useEffect(() => {
    if (isCreateMode) return; // Skip fetch for CREATE mode
    
    const action = sessionStorage.getItem("userAction");
    if (action) {
      setUserAction(parseInt(action));
    }
    const fetchRole = async () => {
      const role = await RoleService.getRoleById(roleId!);
      setRole(role);
      setCacheRole(role);
      roleForm.reset(role);
    };
    fetchRole();
  }, [roleId, roleForm, isCreateMode]);

  // Change action (view/edit)
  const changeAction = (action: UserAction) => {
    if (action === UserAction.DETAILT && cacheRole) {
      roleForm.reset(cacheRole);
    }
    setUserAction(action);
  };

  // Submit form
  const onSubmit = async (values: RoleSchema) => {
    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        // CREATE mode - create new role
        await RoleService.createRole({
          name: values.name,
          permissionNames: values.permissionNames || [],
        });
        sessionStorage.removeItem("userAction");
        toast.success("Tạo vai trò thành công!");
        router.push("/admin/roles");
      } else {
        // UPDATE mode - update existing role
        await RoleService.updateRole(values as Role);

        const updatedRole = await RoleService.getRoleById(roleId!);
        setRole(updatedRole);
        setCacheRole(updatedRole);
        sessionStorage.removeItem("userAction");
        changeAction(UserAction.DETAILT);
        toast.success("Cập nhật vai trò thành công!");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || (isCreateMode ? "Đã xảy ra lỗi khi tạo vai trò" : "Đã xảy ra lỗi khi cập nhật vai trò");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log(errors);
    toast.error("Vui lòng kiểm tra lại thông tin");
  };

  // redirect to list
  const redirectToList = () => {
    router.push("/admin/roles");
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          {userAction === UserAction.CREATE ? (
            <h1 className="text-2xl font-bold tracking-tight">
              Thêm vai trò mới
            </h1>
          ) : userAction === UserAction.DETAILT ? (
            <h1 className="text-2xl font-bold tracking-tight">
              Chi tiết vai trò
            </h1>
          ) : (
            <h1 className="text-2xl font-bold tracking-tight">
              Cập nhật vai trò
            </h1>
          )}
          <p className="text-sm text-muted-foreground">
            {userAction === UserAction.CREATE
              ? "Điền thông tin để tạo vai trò mới."
              : userAction === UserAction.DETAILT
              ? "Xem và cập nhật thông tin vai trò và quyền hạn."
              : "Cập nhật thông tin vai trò và quyền hạn."}
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            onClick={redirectToList}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-row items-start gap-6">
        {!isCreateMode && (
          <div className="flex flex-col gap-6 lg:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Shield className="h-12 w-12 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold capitalize">{role?.name}</h2>
                    <p className="text-sm text-muted-foreground">ID: #{role?.id}</p>
                  </div>

                  <div className="w-full mt-4">
                    <h3 className="text-sm font-medium mb-2">Quyền hạn</h3>
                    <div className="flex flex-wrap gap-2">
                      {role?.permissionNames && role.permissionNames.length > 0 ? (
                        role.permissionNames.map((permission, idx) => (
                          <Badge key={idx} variant="secondary">
                            {permission}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Không có quyền nào được gán
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Ngày tạo</p>
                      <p className="text-sm font-medium">
                        {role?.createdAt
                          ? dayjs(role.createdAt).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cập nhật</p>
                      <p className="text-sm font-medium">
                        {role?.updatedAt
                          ? dayjs(role.updatedAt).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* form */}
        <div className={isCreateMode ? "w-full" : "lg:w-2/3"}>
          <Card>
            <CardHeader>
              <CardTitle>{isCreateMode ? "Thông tin vai trò mới" : "Thông tin vai trò"}</CardTitle>
              {!isCreateMode && (
                <div className="text-sm text-muted-foreground font-semibold">
                  ID : #{role?.id}
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...roleForm}>
                <form
                  onSubmit={roleForm.handleSubmit(onSubmit, onError)}
                  className="space-y-6"
                >
                  <FormField
                    control={roleForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên vai trò <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            disabled={userAction === UserAction.DETAILT}
                            placeholder="Nhập tên vai trò"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* quyền */}
                  {!isCreateMode && (
                    <div>
                      <label className="text-sm font-medium">Quyền hạn hiện tại</label>
                      <div className="mt-2 p-4 rounded-lg border bg-muted/50">
                        <div className="flex flex-wrap gap-2">
                          {role?.permissionNames && role.permissionNames.length > 0 ? (
                            role.permissionNames.map((permission, idx) => (
                              <Badge key={idx} variant="secondary">
                                {permission}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Không có quyền nào được gán
                            </span>
                          )}
                        </div>
                        {userAction === UserAction.UPDATE && (
                          <p className="text-xs text-muted-foreground mt-2">
                            * Để thay đổi quyền hạn, vui lòng sử dụng trang quản lý quyền.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {isCreateMode && (
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        * Quyền hạn có thể được gán sau khi tạo vai trò thông qua trang quản lý quyền.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 border-t pt-6">
                    {userAction === UserAction.DETAILT ? (
                      <Button
                        type="button"
                        size="sm"
                        className="bg-orange-400 hover:bg-orange-600 text-white"
                        onClick={() => changeAction(UserAction.UPDATE)}
                      >
                        <SquarePen className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-500 hover:text-white"
                          onClick={() => isCreateMode ? redirectToList() : changeAction(UserAction.DETAILT)}
                        >
                          <CircleX className="h-4 w-4" />
                          Hủy bỏ
                        </Button>
                        <Button
                          type="submit"
                          variant="default"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          <Save className="h-4 w-4" />
                          {isCreateMode 
                            ? (isSubmitting ? "Đang tạo..." : "Tạo vai trò")
                            : (isSubmitting ? "Đang lưu..." : "Lưu thay đổi")
                          }
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
