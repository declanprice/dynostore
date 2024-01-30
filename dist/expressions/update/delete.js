"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = void 0;
const del = (path, value) => {
    return {
        type: 'delete',
        path,
        value
    };
};
exports.del = del;
