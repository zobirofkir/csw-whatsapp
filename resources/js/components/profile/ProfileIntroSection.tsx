import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IntroForm } from '@/types/profile';

interface Props {
    introForm: IntroForm;
    activeIntroForm: 'bio' | 'details' | 'featured' | null;
    setIntroForm: (form: IntroForm) => void;
    setActiveIntroForm: (type: 'bio' | 'details' | 'featured' | null) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileIntroSection({ introForm, activeIntroForm, setIntroForm, setActiveIntroForm, onSubmit }: Props) {
    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-[17px] font-semibold">Intro</h2>
            <div className="mt-3 space-y-3">
                {activeIntroForm === 'bio' ? (
                    <form onSubmit={onSubmit} className="space-y-3">
                        <Textarea
                            placeholder="Write something about yourself..."
                            value={introForm.bio}
                            onChange={(e) => setIntroForm({ ...introForm, bio: e.target.value })}
                            className="min-h-[100px]"
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
                        className="w-full justify-center bg-gray-100 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        onClick={() => setActiveIntroForm('bio')}
                    >
                        {introForm.bio ? 'Edit bio' : 'Add bio'}
                    </Button>
                )}

                {activeIntroForm === 'details' ? (
                    <form onSubmit={onSubmit} className="space-y-3">
                        <div className="space-y-2">
                            <Input
                                placeholder="Work"
                                value={introForm.work}
                                onChange={(e) => setIntroForm({ ...introForm, work: e.target.value })}
                            />
                            <Input
                                placeholder="Education"
                                value={introForm.education}
                                onChange={(e) => setIntroForm({ ...introForm, education: e.target.value })}
                            />
                            <Input
                                placeholder="Location"
                                value={introForm.location}
                                onChange={(e) => setIntroForm({ ...introForm, location: e.target.value })}
                            />
                            <Input
                                placeholder="Relationship Status"
                                value={introForm.relationship}
                                onChange={(e) => setIntroForm({ ...introForm, relationship: e.target.value })}
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
                        className="w-full justify-center bg-gray-100 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        onClick={() => setActiveIntroForm('details')}
                    >
                        {Object.values(introForm).some(Boolean) ? 'Edit details' : 'Add details'}
                    </Button>
                )}

                {/* Display saved intro information */}
                {(introForm.bio || introForm.work || introForm.education || introForm.location || introForm.relationship) && (
                    <div className="mt-4 space-y-2 text-sm">
                        {introForm.bio && <p>{introForm.bio}</p>}
                        {introForm.work && (
                            <p className="flex items-center gap-2">
                                <i className="fas fa-briefcase" /> Works at {introForm.work}
                            </p>
                        )}
                        {introForm.education && (
                            <p className="flex items-center gap-2">
                                <i className="fas fa-graduation-cap" /> Studied at {introForm.education}
                            </p>
                        )}
                        {introForm.location && (
                            <p className="flex items-center gap-2">
                                <i className="fas fa-home" /> Lives in {introForm.location}
                            </p>
                        )}
                        {introForm.relationship && (
                            <p className="flex items-center gap-2">
                                <i className="fas fa-heart" /> {introForm.relationship}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
