export interface ApplicationData {
    id: number;
    position: string;
    statusId: number | 0;
    organization: string;
    dateApplied: number;
    lastResponse: number;
    url: string;
    siteUser: string;
    sitePass: string;
    sourceId: number | 0;
    jobPosting: string;
    notes: string;
    created: number;
    updated: number;
}

export function NewApplicationData(): ApplicationData {
    return {
        id: 0,
        position: "",
        statusId: 0,
        organization: "",
        dateApplied: 0,
        lastResponse: 0,
        url: "",
        siteUser: "",
        sitePass: "",
        sourceId: 0,
        jobPosting: "",
        notes: "",
        created: 0,
        updated: 0,
    };
}
