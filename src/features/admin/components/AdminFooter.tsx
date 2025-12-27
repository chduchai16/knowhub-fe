export function AdminFooter() {
    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-4 px-6">
            <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                <p>&copy; {new Date().getFullYear()} KnowHub Admin. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-50">
                        Terms
                    </a>
                    <a href="#" className="hover:text-neutral-900 dark:hover:text-neutral-50">
                        Privacy
                    </a>
                </div>
            </div>
        </footer>
    );
}
