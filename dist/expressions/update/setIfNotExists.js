"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIfNotExists = void 0;
const setIfNotExists = (path, value) => {
    return {
        type: 'setIfNotExists',
        path,
        value
    };
};
exports.setIfNotExists = setIfNotExists;
