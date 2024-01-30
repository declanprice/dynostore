"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lt = void 0;
const lt = (path, value) => {
    return {
        type: 'lt',
        path,
        value
    };
};
exports.lt = lt;
