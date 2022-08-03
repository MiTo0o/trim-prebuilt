"use strict";
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
const connect_1 = __importDefault(require("./connect"));
const schema_models_1 = require("./schema.models");
const mongoose_1 = __importDefault(require("mongoose"));
describe('Connects to DB', () => {
    test('Connects to DB', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield (0, connect_1.default)();
            // Successful connection will call this code.
            expect(true).toBeTruthy();
            yield mongoose_1.default.connection.close();
        }
        catch (err) {
            console.log(err.message);
            // Error in connection will call this code.
            expect(false).toBeTruthy();
        }
    }));
});
describe('Connects to DB', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_1.default)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        ;
    }));
    test('Makes Daily Entries', () => __awaiter(void 0, void 0, void 0, function* () {
        var entryObject = {
            user_id: new mongoose_1.default.Types.ObjectId().toString(),
            entryDate: (0, schema_models_1.todayMidnight)(),
            foodItems: [{
                    label: 'Big Mac',
                    nutrients: {
                        "ENERC_KCAL": 257,
                        "PROCNT": 11.82,
                        "FAT": 14.96,
                        "CHOCDF": 20.08,
                        "FIBTG": 1.6
                    },
                    wholeWeight: 213,
                }],
            waterAmount: 1,
            weightAmount: 1,
        };
        entryObject = JSON.parse(JSON.stringify(entryObject));
        try {
            var result = yield schema_models_1.dailyEntriesModel.create(entryObject);
            result = JSON.parse(JSON.stringify(result));
            expect(result).toMatchObject(entryObject);
        }
        catch (err) {
            throw err;
        }
        yield schema_models_1.dailyEntriesModel.findOneAndDelete({}, { "sort": { "_id": -1 } });
    }));
});
