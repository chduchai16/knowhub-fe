"use client";

import { User } from "@/features/admin/models/user";
import { userSchema, UserSchema } from "@/features/admin/schemas/user-schema";
import { UserService } from "@/features/admin/services/user-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/shared/components/ui/item";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, CalendarIcon, Camera, LogOut, Save, SendHorizonal, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserAction } from "@/shared/models/user-action";
import { toast } from "sonner";

interface UserDetailProps {
  userId: string;
}

export function UserDetail({ userId }: UserDetailProps) {
  const [user, setUser] = useState<User | null>(null);
  const [cacheUser , setCacheUser] = useState<User | null>(null);
  const [userAction , setUserAction] = useState<UserAction>(UserAction.DETAILT);  

  // Khởi tạo form với default values rỗng
  const userForm = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: 0,
      username: "",
      email: "",
      fullName: "",
      bio: "",
      avatarUrl: "",
      roleId: 0,
      roleName: "",
      followerQuantity: 0,
      followingQuantity: 0,
      postQuantity: 0,
      gender: "",
      dateOfBirth: "",
      status: "",
      createdAt: "",
      updatedAt: "",
    },
    mode: "onBlur",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserService.getUserById(userId);
      setUser(user);
    };
    fetchUser();
  }, [userId]);

  // Reset form khi user data đã load xong
  useEffect(() => {
    if (user) {
      userForm.reset(user);
      setCacheUser(user);
    }
  }, [user, userForm]);

  // thay đổi trạng thái của người dùng
  const changeAction = (action : UserAction) => {
    if(action === UserAction.DETAILT && cacheUser){
      userForm.reset(cacheUser);
    }
    setUserAction(action);
  }

  // gửi dữ liệu 
  const onSubmit = async (values: UserSchema) => {
    console.log("Form values:", values);
    const user = await UserService.updateUser(values);
    setUser(user);
    setCacheUser(user);
    changeAction(UserAction.DETAILT);
  };

  const onError = (errors: any) => {
    toast.error("Đã xảy ra lỗi khi cập nhật người dùng");
  };

  // Helper function để lấy config cho status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; dotColor: string }> = {
      ACTIVE: { 
        label: "Đang hoạt động", 
        className: "bg-green-300 text-green-700 font-semibold pointer-events-none",
        dotColor: "bg-green-700"
      },
      INACTIVE: { 
        label: "Đang khóa", 
        className: "bg-red-300 text-red-700 font-semibold pointer-events-none",
        dotColor: "bg-red-700"
      },
      SUSPENDED: { 
        label: "Đang khóa tạm thời", 
        className: "bg-yellow-300 text-yellow-700 font-semibold pointer-events-none",
        dotColor: "bg-yellow-700"
      },
      DELETED: { 
        label: "Đã xóa", 
        className: "bg-gray-300 text-gray-700 font-semibold pointer-events-none",
        dotColor: "bg-gray-700"
      },
    };
    return statusConfig[status] || { label: status, className: "bg-gray-200 text-gray-700 pointer-events-none", dotColor: "bg-gray-400" };
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Chi tiết người dùng #{userId}
          </h1>
          <p className="text-sm text-muted-foreground">
            Xem và cập nhật thông tin cá nhân, quyền hạn và trạng thái.
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-row items-start gap-6">
        <div className="flex flex-col gap-6 lg:w-1/3">
          <div className="relative rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            {/*Background */}
            <div className="absolute top-0 left-0 right-0 h-36 bg-blue-500 rounded-t-xl" />
            
            {/* Content */}
            <div className="relative flex flex-col gap-6 p-6">
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src="https://github.com/shadcn.png" alt="avatar"/>
                    <AvatarFallback>USER</AvatarFallback>
                  </Avatar>

                  <Button
                    variant="outline"
                    size="sm"
                    className="
                      bg-blue-500 text-white
                      hover:bg-blue-600 hover:text-white
                      rounded-full
                      w-10 h-10
                      p-0
                      absolute
                      bottom-0
                      right-0
                      "
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>

                <div className="text-center">
                  <h2 className="text-lg font-semibold">{user?.fullName}</h2>
                  <p className="text-sm text-muted-foreground">@{user?.username}</p>
                </div>

                {user?.status && (
                  <Badge className={getStatusBadge(user.status).className}>
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusBadge(user.status).dotColor}`}
                    />
                    {getStatusBadge(user.status).label}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Statistics Section */}
            <Separator />
            <div className="relative flex flex-row items-center justify-between gap-4 p-6">
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-lg font-semibold">{user?.followingQuantity || 0}</span>
                  <span className="text-sm font-semibold text-muted-foreground">Đang theo dõi</span>
                </div>
                <div className="h-12 w-px bg-border"/>
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-lg font-semibold">{user?.followerQuantity || 0}</span>
                  <span className="text-sm font-semibold text-muted-foreground">Người theo dõi</span>
                </div>
                <div className="h-12 w-px bg-border"/>
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-lg font-semibold">{user?.postQuantity || 0}</span>
                  <span className="text-sm font-semibold text-muted-foreground">Bài viết</span>
                </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span>Bảo mật & đăng nhập</span>
                </h2>
              </div>
              <div className="flex flex-col gap-6">
                <Item variant="outline" className="hover:cursor-pointer">
                  <ItemContent>
                    <ItemTitle>Đặt lại mật khẩu</ItemTitle>
                    <ItemDescription>
                      Gửi email để khôi phục mật khẩu
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="hover:text-gray-600">
                    <SendHorizonal className="h-4 w-4" />
                  </ItemActions>
                </Item>
                <Item variant="outline" className="hover:cursor-pointer">
                  <ItemContent>
                    <ItemTitle>Đăng xuất khỏi các thiết bị khác</ItemTitle>
                    <ItemDescription>
                      Xóa tất cả các thiết bị đã đăng nhập
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="hover:text-gray-600">
                    <LogOut className="h-4 w-4" />
                  </ItemActions>
                </Item>
              </div>
            </div>
          </div>
        </div>

        <Card className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 lg:w-2/3">
          <CardHeader className="border-b pb-6 flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">
              Thông tin người dùng
            </h2>
            <div className="text-sm text-muted-foreground font-semibold">
              ID : #{user?.id}
            </div>
        </CardHeader>
          <CardContent className="pt-6">
            <Form {...userForm}>
              <form
                onSubmit={userForm.handleSubmit(onSubmit, onError)}
                className="grid grid-cols-2 gap-6"
              >
                <FormField
                  control={userForm.control}
                  name="fullName"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input disabled={userAction !== UserAction.UPDATE} placeholder="Họ và tên" {...field} value={field.value || ''}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="username"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input disabled={userAction !== UserAction.UPDATE} placeholder="Tên đăng nhập" {...field} value={field.value || ''}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="email"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Địa chỉ email</FormLabel>
                      <FormControl>
                        <Input disabled={userAction !== UserAction.UPDATE} placeholder="Địa chỉ email" {...field} value={field.value || ''}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={userForm.control}
                  name="gender"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                       <FormControl>
                        <Select
                          disabled={userAction !== UserAction.UPDATE}
                          value={String(field.value)}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Nam</SelectItem>
                            <SelectItem value="FEMALE">Nữ</SelectItem>
                            <SelectItem value="OTHER">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="dateOfBirth"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={userAction !== UserAction.UPDATE}
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(new Date(field.value), "dd MMMM yyyy", { locale: vi }) : <span>Chọn ngày sinh</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="roleId"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                       <FormControl>
                        <Select
                          disabled={userAction !== UserAction.UPDATE}
                          value={String(field.value)}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Admin</SelectItem>
                            <SelectItem value="2">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="status"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                       <FormControl>
                        <Select
                          disabled={userAction !== UserAction.UPDATE}
                          value={String(field.value)}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                            <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                            <SelectItem value="SUSPENDED">Khóa tạm thời</SelectItem>
                            <SelectItem value="DELETED">Đã xóa</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="bio"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Giới thiệu</FormLabel>
                       <FormControl>
                        <Textarea disabled={userAction !== UserAction.UPDATE} placeholder="Tiểu sử" {...field} value={field.value || ''} className="h-[150px]"/>
                      </FormControl>
                      <FormDescription className="text-xs text-right">
                        {field.value?.length || 0}/1000 ký tự
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                
                {/* Form Actions */}
                <div className="col-span-2 flex justify-end gap-2 border-t pt-6">
                  {userAction === UserAction.DETAILT ? 
                    <Button 
                      type="button"
                      size="sm" 
                      className="bg-orange-400 hover:bg-orange-600 text-white" 
                      onClick={() => changeAction(UserAction.UPDATE)}
                    >
                      Chỉnh sửa
                    </Button>
                  : 
                    <>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-red-500 hover:text-white" 
                        onClick={() => changeAction(UserAction.DETAILT)}
                      >
                        Hủy bỏ
                      </Button>
                      <Button 
                        type="submit"
                        variant="default" 
                        className="bg-blue-500 hover:bg-blue-600 text-white" 
                        size="sm"
                      >
                        <Save />
                        Lưu thay đổi
                      </Button>
                    </>
                  }
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );  
}
