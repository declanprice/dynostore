"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const exists = (path) => {
    return {
        type: 'exists',
        path
    };
};
exports.exists = exists;
