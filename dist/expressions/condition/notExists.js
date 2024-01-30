"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notExists = void 0;
const notExists = (path) => {
    return {
        type: 'notExists',
        path,
    };
};
exports.notExists = notExists;
