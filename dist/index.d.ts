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
export default function healthcheck(checks: Adapter[]): Promise<Response[]>;
