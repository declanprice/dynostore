"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = void 0;
const set = (path, value) => {
    return {
        type: 'set',
        path,
        value
    };
};
exports.set = set;
