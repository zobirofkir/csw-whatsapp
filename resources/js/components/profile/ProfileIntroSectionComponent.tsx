import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IntroForm } from '@/types/profile';
import { router } from '@inertiajs/react';

interface Props {
    introForm: IntroForm;
    activeIntroForm: 'bio' | 'details' | 'featured' | null;
    setIntroForm: (form: IntroForm) => void;
    setActiveIntroForm: (type: 'bio' | 'details' | 'featured' | null) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileIntroSectionComponent({ introForm, activeIntroForm, setIntroForm, setActiveIntroForm, onSubmit }: Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(route('profile.update.intro'), {
            bio: introForm.bio,
            details: {
                work: introForm.work,
                education: introForm.education,
                location: introForm.location,
                relationship: introForm.relationship,
            }
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setActiveIntroForm(null);
            },
        });
    };

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-5">
            <h2 className="text-[17px] font-semibold">Intro</h2>
            <div className="mt-4 space-y-4">
                {/* Bio Section */}
                {activeIntroForm === 'bio' ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Textarea
                            placeholder="Describe who you are"
                            value={introForm.bio}
                            onChange={(e) => setIntroForm({ ...introForm, bio: e.target.value })}
                            className="min-h-[100px] text-sm"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={() => setActiveIntroForm(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                ) : (
                    <Button
                        variant="secondary"
                        className="w-full justify-center bg-gray-100 py-2.5 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        onClick={() => setActiveIntroForm('bio')}
                    >
                        {introForm.bio ? 'Edit bio' : 'Add bio'}
                    </Button>
                )}

                {/* Details Section */}
                {activeIntroForm === 'details' ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-2.5">
                            <Input
                                placeholder="Add work"
                                value={introForm.work}
                                onChange={(e) => setIntroForm({ ...introForm, work: e.target.value })}
                                className="text-sm"
                            />
                            <Input
                                placeholder="Add education"
                                value={introForm.education}
                                onChange={(e) => setIntroForm({ ...introForm, education: e.target.value })}
                                className="text-sm"
                            />
                            <Input
                                placeholder="Add current city"
                                value={introForm.location}
                                onChange={(e) => setIntroForm({ ...introForm, location: e.target.value })}
                                className="text-sm"
                            />
                            <Input
                                placeholder="Add relationship status"
                                value={introForm.relationship}
                                onChange={(e) => setIntroForm({ ...introForm, relationship: e.target.value })}
                                className="text-sm"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={() => setActiveIntroForm(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                ) : (
                    <Button
                        variant="secondary"
                        className="w-full justify-center bg-gray-100 py-2.5 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        onClick={() => setActiveIntroForm('details')}
                    >
                        {Object.values(introForm).some(Boolean) ? 'Edit details' : 'Add details'}
                    </Button>
                )}

                {/* Display saved intro information */}
                {(introForm.bio || introForm.work || introForm.education || introForm.location || introForm.relationship) && (
                    <div className="space-y-2.5 text-[15px] text-gray-700 dark:text-gray-300">
                        {introForm.bio && <p className="whitespace-pre-wrap">{introForm.bio}</p>}
                        {introForm.work && (
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">💼</span>
                                <p>Works at <span className="font-semibold">{introForm.work}</span></p>
                            </div>
                        )}
                        {introForm.education && (
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">🎓</span>
                                <p>Studied at <span className="font-semibold">{introForm.education}</span></p>
                            </div>
                        )}
                        {introForm.location && (
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">📍</span>
                                <p>Lives in <span className="font-semibold">{introForm.location}</span></p>
                            </div>
                        )}
                        {introForm.relationship && (
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">❤️</span>
                                <p className="font-semibold">{introForm.relationship}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
