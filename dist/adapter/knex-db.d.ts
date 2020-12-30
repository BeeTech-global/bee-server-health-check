import knex from 'knex';
import { Adapter, AdapterResponse } from '../index';
export default class KnexDBAdapter implements Adapter {
    readonly name: string;
    readonly host: string;
    readonly isRequired: boolean;
    private readonly knexInstance;
    constructor(name: string, host: string, isRequired: boolean, knexInstance: knex);
    check(): Promise<AdapterResponse>;
}
