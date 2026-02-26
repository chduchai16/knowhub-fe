import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import Link from "next/link";

export function AuthHeader() {
    return (
        <div className="h-15 flex justify-between items-center px-6 text-white py-4">
            <div className="bg-blue-500 rounded-lg p-1">
                <Avatar className="w-10 h-10">
                    <AvatarImage
                        src={'/assets/logo-svg.svg'}
                        alt="KnowHub"
                        className="w-full h-full object-contain"
                    />
                </Avatar>
            </div>
            <div>
                <Link href="/help" className="text-gray-500 no-underline hover:underline hover:text-gray-700 text-md">
                    Trợ giúp
                </Link>
            </div>
        </div>
    )
}