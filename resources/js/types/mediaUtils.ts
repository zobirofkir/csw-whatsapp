export function getMediaGridClass(totalMedia: number): string {
    switch (Math.min(totalMedia, 4)) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-2';
        case 4: return 'grid-cols-2';
        default: return 'grid-cols-1';
    }
}

export function getMediaAspectClass(totalMedia: number, index: number): string {
    if (totalMedia === 1) return 'aspect-[16/9]';
    if (totalMedia === 2) return 'aspect-square';
    if (totalMedia === 3 && index === 0) return 'aspect-[16/9] col-span-2';
    if (totalMedia === 3) return 'aspect-square';
    if (totalMedia === 4) return 'aspect-square';
    return 'aspect-square';
}
