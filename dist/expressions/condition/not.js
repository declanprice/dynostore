"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = void 0;
const not = (condition) => {
    return {
        type: 'not',
        condition
    };
};
exports.not = not;
