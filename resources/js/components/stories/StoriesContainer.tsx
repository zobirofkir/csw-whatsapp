import { SAMPLE_STORIES } from '@/data/sampleStories';
import Story from './Story';

export default function StoriesContainer() {
    return (
        <div className="rounded-xl bg-white p-4 shadow dark:bg-gray-800">
            <div className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 flex space-x-2 overflow-x-auto">
                <div className="group relative h-48 w-28 min-w-[112px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 sm:h-52 sm:w-32 dark:bg-gray-700">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 text-white"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <p className="mt-4 text-sm font-medium dark:text-gray-200">Create Story</p>
                    </div>
                </div>

                {SAMPLE_STORIES.map((story) => (
                    <Story key={story.id} {...story} />
                ))}
            </div>
        </div>
    );
}
