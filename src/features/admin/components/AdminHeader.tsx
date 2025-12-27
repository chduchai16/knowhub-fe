import { Bell, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function AdminHeader() {
    return (
        <header className="flex h-16 items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 sticky top-0 z-10">
            <div className="flex flex-1 gap-4 md:gap-8">
                <form className="ml-auto flex-1 md:grow-0">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 pl-8 md:w-[200px] lg:w-[320px]"
                        />
                    </div>
                </form>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-neutral-500">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </div>
        </header>
    );
}
