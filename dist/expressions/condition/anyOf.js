"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyOf = void 0;
const anyOf = (path, values) => {
    return {
        type: 'anyOf',
        path,
        values
    };
};
exports.anyOf = anyOf;
