export interface CapsuleData {
    title: string;
    description?: string;
    openingDate?: string;
    files?: File[];
    status?: 'opened' | 'sealed'
    creationDate?: string;
    id?: number;
} 