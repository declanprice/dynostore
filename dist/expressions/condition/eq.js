"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eq = void 0;
const eq = (path, value) => {
    return {
        type: 'eq',
        path,
        value
    };
};
exports.eq = eq;
