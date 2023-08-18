import { SoftwareCompany, SoftwareCompanyDto } from "./softwareCompany";

export interface InitialProjectRequest {
    id: string;
    projectName: string;
    projectDescription: string;
    dueDate: Date;
    rejected: boolean;
    clientId: string;
    client: SoftwareCompany;
};

export interface InitialProjectRequestDto {
    id: string;
    projectName: string;
    projectDescription: string;
    dueDate: string;
    rejected: boolean;
    clientId: string;
    client: SoftwareCompanyDto;
};

export interface CreateInitialProjectRequest {
    projectName: string;
    projectDescription: string;
    dueDate: string;
    rejected: boolean;
    clientId: string;
}