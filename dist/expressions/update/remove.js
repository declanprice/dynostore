"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = void 0;
const remove = (path) => {
    return {
        type: 'remove',
        path
    };
};
exports.remove = remove;
