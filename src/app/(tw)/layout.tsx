export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header (sticky) */}
            <header className="sticky top-0 z-50 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <h1 className="text-lg font-semibold">Header</h1>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                {children}
            </main>

            {/* Footer (NOT sticky) */}
            <footer className="border-t bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">
                    Footer
                </div>
            </footer>
        </div>
    );
}
