"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const __1 = __importDefault(require(".."));
class BeeServerApiController {
    constructor(appName, appVersion, checkAdapters) {
        this.appName = appName;
        this.appVersion = appVersion;
        this.checkAdapters = checkAdapters;
    }
    basic(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.response.status = http_status_codes_1.default.OK;
            ctx.response.body = {
                name: this.appName,
                version: this.appVersion,
            };
        });
    }
    detailed(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield __1.default(this.checkAdapters);
            const summary = result.reduce((agg, service) => {
                const totalElapsedTime = agg.totalElapsedTime + service.elapsedTime;
                if (service.isUp) {
                    return Object.assign(Object.assign({}, agg), { up: agg.up + 1, totalElapsedTime });
                }
                if (service.isRequired) {
                    if (service.isUp) {
                        return Object.assign(Object.assign({}, agg), { requiredDown: agg.requiredDown + 1, totalElapsedTime });
                    }
                }
                return Object.assign(Object.assign({}, agg), { optionalDown: agg.optionalDown + 1, totalElapsedTime });
            }, {
                up: 0,
                totalElapsedTime: 0,
                requiredDown: 0,
                optionalDown: 0,
            });
            ctx.response.status = summary.requiredDown > 0 ? http_status_codes_1.default.SERVICE_UNAVAILABLE : http_status_codes_1.default.OK;
            ctx.response.body = {
                name: this.appName,
                version: this.appVersion,
                summary,
                services: result,
            };
        });
    }
}
exports.default = BeeServerApiController;
