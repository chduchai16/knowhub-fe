import AuthTabs from "@/features/auth/components/auth-tabs";

export const metadata = {
	title: "Đăng ký - KnowHub",
};

export default function Page() {
	return (
		<div className="flex items-center justify-center">
			<AuthTabs />
		</div>
	);
}
 