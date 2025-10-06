export type Screen = 'home' | 'tutorials' | 'infpaciente' | 'detail';

export type Tutorial = {
    id: string;
    title: string;
    steps: string[];
    updatedAt: string;
    body: string;
};