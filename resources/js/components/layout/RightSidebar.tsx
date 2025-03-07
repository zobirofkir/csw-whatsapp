import ContactsList from './contacts/ContactsList';

export default function RightSidebar() {
    return (
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <h3 className="mb-3 font-semibold dark:text-gray-200">Contacts</h3>
                <ContactsList />
            </div>
        </div>
    );
}
