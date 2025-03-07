import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [email, setEmail] = useState('');

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <nav className="fixed z-50 w-full bg-white/80 shadow-sm backdrop-blur-md dark:bg-gray-900/80">
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

                {/* Hero Section with Animation */}
                <div className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),transparent)] opacity-20 dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.900),transparent)]"></div>
                    </div>
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-7xl dark:text-white">
                                Connect with Friends,
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-blue-600 text-transparent dark:text-blue-400">
                                    Share Your Story
                                </span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                                Join millions of people and stay connected with friends, family, and communities. Experience the next generation of
                                social networking.
                            </p>

                            {/* Early Access Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mx-auto mt-8 max-w-md"
                            >
                                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                    <button className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
                                        Get Early Access
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>

                        {/* Features Grid */}
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

                        {/* Statistics Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4"
                        >
                            {[
                                { number: '10M+', label: 'Active Users' },
                                { number: '150+', label: 'Countries' },
                                { number: '99.9%', label: 'Uptime' },
                                { number: '24/7', label: 'Support' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                                    <div className="mt-2 text-gray-600 dark:text-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Testimonials Section */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-24">
                            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {[
                                    {
                                        quote: "SocialConnect has transformed how I stay in touch with my friends abroad. It's intuitive and fun to use!",
                                        author: 'Sarah Johnson',
                                        role: 'Digital Nomad',
                                    },
                                    {
                                        quote: "The best social platform I've used. The community features are outstanding!",
                                        author: 'Michael Chen',
                                        role: 'Community Leader',
                                    },
                                    {
                                        quote: 'Privacy-focused and user-friendly. Finally, a social network that puts users first!',
                                        author: 'Emma Williams',
                                        role: 'Privacy Advocate',
                                    },
                                ].map((testimonial, index) => (
                                    <div key={index} className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                        <div className="mb-4 flex items-center">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900"></div>
                                            <div className="ml-4">
                                                <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic dark:text-gray-300">"{testimonial.quote}"</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="mt-24 rounded-2xl bg-blue-600 p-12 text-center dark:bg-blue-700"
                        >
                            <h2 className="mb-4 text-3xl font-bold text-white">Ready to Get Started?</h2>
                            <p className="mx-auto mb-8 max-w-2xl text-blue-100">
                                Join our growing community today and experience the future of social networking.
                            </p>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-lg font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                            >
                                Get Started
                                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-24 bg-white/80 py-12 dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Product</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Security
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Company</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Careers
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Resources</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Community
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Legal</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Privacy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Terms
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                            Cookie Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
                            © 2024 SocialConnect. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
