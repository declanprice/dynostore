"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
const add = (path, value) => {
    return {
        type: 'add',
        path,
        value
    };
};
exports.add = add;
