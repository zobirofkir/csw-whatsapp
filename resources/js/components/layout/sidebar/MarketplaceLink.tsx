export default function MarketplaceLink() {
    return (
        <div className="flex items-center space-x-2">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-black dark:text-white">Marketplace</span>
        </div>
    );
}
