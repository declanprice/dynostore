"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gte = void 0;
const gte = (path, value) => {
    return {
        type: 'gte',
        path,
        value
    };
};
exports.gte = gte;
