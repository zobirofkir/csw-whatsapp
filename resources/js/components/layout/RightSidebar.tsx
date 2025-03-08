import ContactsList from './contacts/ContactsList';

export default function RightSidebar() {
    return (
        <div className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[360px] overflow-y-auto px-4 pt-2 lg:block">
            <div className="rounded-lg p-4">
                <h3 className="mb-3 text-[17px] font-semibold text-[#65676B] dark:text-[#B0B3B8]">Contacts</h3>
                <ContactsList />
            </div>
        </div>
    );
}
