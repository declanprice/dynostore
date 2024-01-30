"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gt = void 0;
const gt = (path, value) => {
    return {
        type: 'gt',
        path,
        value
    };
};
exports.gt = gt;
