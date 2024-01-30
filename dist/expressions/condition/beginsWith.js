"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beginsWith = void 0;
const beginsWith = (path, value) => {
    return {
        type: 'beginsWith',
        path,
        value
    };
};
exports.beginsWith = beginsWith;
