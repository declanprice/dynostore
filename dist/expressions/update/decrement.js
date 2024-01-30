"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrement = void 0;
const decrement = (path, value) => {
    return {
        type: 'decrement',
        path,
        value
    };
};
exports.decrement = decrement;
