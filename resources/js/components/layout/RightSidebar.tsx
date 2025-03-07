import ContactsList from './contacts/ContactsList';

export default function RightSidebar() {
    return (
        <div className="fixed right-0 hidden h-screen w-1/4 overflow-y-auto pt-4 pr-4 lg:block">
            <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <h3 className="mb-3 font-semibold dark:text-gray-200">Contacts</h3>
                <ContactsList />
            </div>
        </div>
    );
}
