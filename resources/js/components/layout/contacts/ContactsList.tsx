interface Contact {
    name: string;
    status: 'online' | 'offline';
    img: string;
}

export default function ContactsList() {
    const contacts: Contact[] = [
        { name: 'Sarah Johnson', status: 'online', img: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Michael Chen', status: 'offline', img: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Emma Wilson', status: 'online', img: 'https://i.pravatar.cc/150?img=3' },
    ];

    return (
        <div className="space-y-1">
            {contacts.map((contact) => (
                <button
                    key={contact.name}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                    <div className="relative flex-shrink-0">
                        <img src={contact.img} alt={contact.name} className="h-9 w-9 rounded-full object-cover" />
                        {contact.status === 'online' && (
                            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{contact.name}</span>
                </button>
            ))}
        </div>
    );
}
