import { Developer } from "./profiles";

export interface Team {
    id: string;
    projectManagerId: string;
    projectId: string;
    developers: Developer[];
}