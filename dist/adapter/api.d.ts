import { Adapter, AdapterResponse } from '../index';
export default class ApiAdapter implements Adapter {
    readonly name: string;
    readonly host: string;
    readonly isRequired: boolean;
    constructor(name: string, host: string, isRequired: boolean);
    check(): Promise<AdapterResponse>;
}
