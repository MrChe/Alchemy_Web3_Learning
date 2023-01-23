

export default function PaginationBar({ currentPage, pageKeys, onClickPage, className = "" }) {
    return (
        <div
            className={`px-4 py-3 flex items-center justify-center border-gray-200 sm:px-6 mt-10 ${className}`}
        >
            <div>
                <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                >
                    <button
                        onClick={() => onClickPage( currentPage - 1)}
                        disabled={currentPage === 0}
                        className="disabled:bg-gray-300 relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>

                    </button>

                    {pageKeys.map((page, i) => {
                        if (currentPage === i) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onClickPage( i)}
                                    aria-current="page"
                                    className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
                                >
                                    {i + 1}
                                </button>
                            );
                        } else {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onClickPage( i)}
                                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
                                >
                                    {i + 1}
                                </button>
                            );
                        }
                    })}

                    <button
                        onClick={() => onClickPage( currentPage + 1)}
                        disabled={!pageKeys[currentPage + 1]}
                        className="disabled:bg-gray-300 relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>

                    </button>
                </nav>
            </div>
        </div>
    );
}