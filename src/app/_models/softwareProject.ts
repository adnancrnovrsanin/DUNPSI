export interface Project {
    id: string;
    clientId: string;
    name: string;
    description: string;
    dueDate: Date;
    finished: boolean;
    assignedTeamId: string;
};

export interface ProjectDto {
    id: string;
    clientId: string;
    name: string;
    description: string;
    dueDate: string;
    finished: boolean;
    assignedTeamId: string;
}