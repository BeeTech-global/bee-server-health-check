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
Object.defineProperty(exports, "__esModule", { value: true });
function elapsedTime(beginning) {
    return new Date().getTime() - beginning;
}
function healthcheck(checks) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(checks.map((check) => __awaiter(this, void 0, void 0, function* () {
            const beginning = new Date().getTime();
            const details = {
                name: check.name,
                host: check.host,
                isRequired: check.isRequired,
            };
            try {
                const result = yield check.check();
                return Object.assign(Object.assign({}, details), { isUp: result.isUp, elapsedTime: elapsedTime(beginning), error: result.error || null });
            }
            catch (e) {
                return Object.assign(Object.assign({}, details), { isUp: false, elapsedTime: elapsedTime(beginning), error: e });
            }
        })));
    });
}
exports.default = healthcheck;
