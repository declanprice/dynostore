"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = void 0;
const group = (...conditions) => {
    return {
        type: 'group',
        conditions
    };
};
exports.group = group;
