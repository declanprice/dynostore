"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lte = void 0;
const lte = (path, value) => {
    return {
        type: 'lte',
        path,
        value
    };
};
exports.lte = lte;
