"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import mongoose from 'mongoose';
const connect_1 = __importDefault(require("./connect"));
const schema_models_1 = require("./schema.models");
console.log("test");
(0, connect_1.default)();
schema_models_1.authModel.create({
    'username': 'ahmad',
    'salt': 1234,
    'hashpass': 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
});
