"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = void 0;
const type = (path, value) => {
    return {
        type: 'type',
        path,
        value
    };
};
exports.type = type;
