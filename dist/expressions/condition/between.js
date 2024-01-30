"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.between = void 0;
const between = (path, valueOne, valueTwo) => {
    return {
        type: 'between',
        path,
        valueOne,
        valueTwo
    };
};
exports.between = between;
