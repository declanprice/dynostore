"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increment = void 0;
const increment = (path, value) => {
    return {
        type: 'increment',
        path,
        value
    };
};
exports.increment = increment;
