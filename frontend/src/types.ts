export type Screen = 'home' | 'tutorials' | 'detail';

export type Tutorial = {
    id: string;
    title: string;
    steps: string[];
    updatedAt: string;
    body: string;
};