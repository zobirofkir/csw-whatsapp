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
        <div className="space-y-4">
            {contacts.map((contact) => (
                <div key={contact.name} className="flex items-center space-x-3">
                    <div className="relative">
                        <img src={contact.img} alt={contact.name} className="h-8 w-8 rounded-full" />
                        <span
                            className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                    </div>
                    <span className="dark:text-gray-200">{contact.name}</span>
                </div>
            ))}
        </div>
    );
}
