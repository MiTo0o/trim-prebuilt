"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const database = process.env.MONGO_DB;
var mongoConnection;
if (process.env.AUTH__METHOD === 'X509') {
    const mongo_uri = process.env.MONGO_URI_X509;
    const certificate = process.env.X509_FILE_NAME;
    const credentials = path_1.default.join(__dirname, `../../${certificate}`);
    mongoConnection = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield mongoose_1.default.connect(mongo_uri, {
                sslKey: credentials,
                sslCert: credentials,
                dbName: database,
            });
            console.log(`Connected to MongoDB Atlas, Database ${database}`);
            return connection;
        }
        catch (err) {
            console.log('Failed to connect to MongoDB Atlas');
            console.log(err);
            throw err;
        }
    });
}
else {
    mongoConnection = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield mongoose_1.default.connect(process.env.MONGO_FULL_URI, {
                dbName: database,
            });
            console.log(`Connected to MongoDB Atlas, Database ${database}`);
            return connection;
        }
        catch (err) {
            console.log('Failed to connect to MongoDB Atlas');
            console.log(err);
            throw err;
        }
    });
}
exports.default = mongoConnection;
