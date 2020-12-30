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
function summary(responses) {
    const reduced = responses.reduce((agg, service) => {
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
        count: 0,
        up: 0,
        totalElapsedTime: 0,
        requiredDown: 0,
        optionalDown: 0,
    });
    return Object.assign({ count: responses.length }, reduced);
}
function check(adapters) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(adapters.map((adapter) => __awaiter(this, void 0, void 0, function* () {
            const beginning = new Date().getTime();
            const details = {
                name: adapter.name,
                host: adapter.host,
                isRequired: adapter.isRequired,
            };
            try {
                const result = yield adapter.check();
                return Object.assign(Object.assign({}, details), { isUp: result.isUp, elapsedTime: elapsedTime(beginning), error: result.error || null });
            }
            catch (e) {
                return Object.assign(Object.assign({}, details), { isUp: false, elapsedTime: elapsedTime(beginning), error: e });
            }
        })));
    });
}
function healthcheck(adapters) {
    return __awaiter(this, void 0, void 0, function* () {
        return summary(yield check(adapters));
    });
}
exports.default = healthcheck;
