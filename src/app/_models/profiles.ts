export interface ProjectManager {
    id: string;
    appUserId: string;
    name: string;
    surname: string;
    email: string;
    certificationUrl: string;
    yearsOfExperience: number;
    currentTeamId: string;
}

export interface ProductManager {
    id: string;
    appUserId: string;
    name: string;
    surname: string;
    email: string;
}

export interface Developer {
    id: string;
    appUserId: string;
    name: string;
    surname: string;
    email: string;
    position: string;
    numberOfActiveTasks: number;
}