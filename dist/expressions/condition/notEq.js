"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notEq = void 0;
const notEq = (path, value) => {
    return {
        type: 'notEq',
        path,
        value
    };
};
exports.notEq = notEq;
