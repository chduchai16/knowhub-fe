import { AuthHeader } from "@/features/auth/auth/components/auth-header";
import AuthSidebar from "@/features/auth/auth/components/auth-sidebar";
import React from "react";

export const metadata = {
    title: "Auth - KnowHub",
    description: "Authentication pages layout",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <AuthHeader />
            <div className="mx-auto mt-10 max-w-5xl rounded-lg overflow-hidden shadow-lg min-h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
                    <div className="h-full">
                        <AuthSidebar/>
                    </div>
                    <div className="flex items-center justify-center bg-white p-8 h-full">
                        <div className="w-full">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
