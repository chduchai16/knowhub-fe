import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";

export default function AuthSidebar({
  bg = "/assets/bg-auth.png",
}: {
  bg?: string;
}) {
  return (
    <aside
      className="relative hidden md:flex h-full flex-col justify-between text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex-1 p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/40 px-3 py-1 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-green-300 inline-block" />
            Cộng đồng đang trực tuyến
          </div>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight">
            Kết nối với thế giới của bạn.
          </h2>

          <p className="mt-4 text-sm text-sky-100/90">
            Khám phá những câu chuyện và kết nối với những người cùng đam mê.
            Tạo khoảnh khắc và kết nối với những người bạn mới có cùng đam mê trên Know Hub.
          </p>
        </div>

        {/* BOTTOM (fixed height) */}
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="flex -space-x-3 items-center">
              <Avatar className="w-8 h-8 ring-2 ring-white">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <Avatar className="w-8 h-8 ring-2 ring-white">
                <AvatarImage src="https://github.com/maxleiter.png" />
              </Avatar>
              <Avatar className="w-8 h-8 ring-2 ring-white">
                <AvatarImage src="https://github.com/evilrabbit.png" />
              </Avatar>
              <div className="inline-flex items-center justify-center rounded-full bg-white text-sky-700 text-xs font-semibold h-8 w-8 ring-2 ring-white z-10">
                +2k
              </div>
            </div>

            <div className="ml-3 text-sm text-sky-100">
              người đã tham gia hôm nay
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
