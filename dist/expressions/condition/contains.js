"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contains = void 0;
const contains = (path, value) => {
    return {
        type: 'contains',
        path,
        value
    };
};
exports.contains = contains;
