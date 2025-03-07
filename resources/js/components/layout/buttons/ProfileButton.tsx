export default function ProfileButton() {
    return (
        <button className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
            <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="h-full w-full object-cover" />
        </button>
    );
}
