import ContactsList from './contacts/ContactsList';

export default function RightSidebar() {
    return (
        <div className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] w-[360px] overflow-y-auto px-4 pt-4">
            <div className="rounded-lg bg-white p-4 dark:bg-[#242526]">
                <h3 className="mb-3 text-[#65676B] font-semibold dark:text-[#B0B3B8]">Contacts</h3>
                <ContactsList />
            </div>
        </div>
    );
}
