export interface Service {
    name: string;
    host: string;
    isRequired: boolean;
}
export interface AdapterResponse {
    isUp: boolean;
    error?: Error;
}
export interface Adapter extends Service {
    check(): Promise<AdapterResponse>;
}
export interface Response extends Service {
    isUp: boolean;
    elapsedTime: number;
    error?: Error;
}
export interface Summary {
    count: number;
    up: number;
    totalElapsedTime: number;
    requiredDown: number;
    optionalDown: number;
    services: Response[];
}
export default function healthcheck(adapters: Adapter[]): Promise<Summary>;
