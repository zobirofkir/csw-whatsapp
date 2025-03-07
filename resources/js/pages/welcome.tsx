import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <nav className="fixed w-full bg-white/80 shadow-sm backdrop-blur-md dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">SocialConnect</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-6xl dark:text-white">
                                Connect with Friends,
                                <br />
                                <span className="text-blue-600 dark:text-blue-400">Share Your Story</span>
                            </h1>
                            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
                                Join millions of people and stay connected with friends, family, and communities
                            </p>
                        </motion.div>

                        {/* 3D Features Grid */}
                        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="transform rounded-2xl bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-800"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Real-time Chat</h3>
                                <p className="text-gray-600 dark:text-gray-300">Stay connected with instant messaging and group chats</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="transform rounded-2xl bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-800"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Photo Sharing</h3>
                                <p className="text-gray-600 dark:text-gray-300">Share your favorite moments with friends and family</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="transform rounded-2xl bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-800"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Communities</h3>
                                <p className="text-gray-600 dark:text-gray-300">Join groups and connect with people who share your interests</p>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
