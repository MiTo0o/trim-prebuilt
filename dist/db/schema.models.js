"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todayMidnight = exports.authModel = exports.foodEntriesModel = exports.userEntriesModel = exports.dailyEntriesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dailyEntriesName = "daily_entries";
const userName = "user_entries";
const foodName = "food_entries";
const authName = "auth_entries";
/**
 *
 * @returns Today's Date at Mightnight
 */
const todayMidnight = () => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};
exports.todayMidnight = todayMidnight;
const foodItemsSchema = new mongoose_1.default.Schema({
    label: String,
    nutrients: { type: mongoose_1.default.Schema.Types.Mixed },
    wholeWeight: {
        type: Number,
        default: 100,
        remark: 'The actual total mass of the Meal',
    },
    // createTime:{type:Date, default:new Date()},
    // updateTime:{type:Date, default:new Date()},
});
const dailyEntriesSchema = new mongoose_1.default.Schema({
    user_id: {
        type: String,
        index: true,
        required: true,
    },
    foodItems: [foodItemsSchema],
    entryDate: {
        type: Date,
        default: todayMidnight(),
        index: true,
    },
    waterAmount: {
        type: Number,
        default: 0,
    },
    weightAmount: {
        type: Number,
        default: 0,
    },
    caloriesAmount: {
        type: Number,
        default: 0,
    }
    // createdTime:{type:Date, default:new Date()},
    // updatedTime:{type:Date, default:new Date()},
});
const webPushSchema = new mongoose_1.default.Schema({
    endpoint: String,
    expirationTime: {
        type: String,
        default: null
    },
    keys: {
        p256dh: String,
        auth: String
    }
});
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
        type: String,
        enum: "M" || "F" || "N",
        remark: 'F is female, M is male, N is non-binary'
    },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    height: { type: Number, required: true, remark: "height in cm" },
    weight: { type: Number, required: true, remark: "weight in kg" },
    caloriesGoal: { type: Number, default: 0, remark: "daily Calories Goal in kcal" },
    caloriesRecommanded: { type: Number, default: 0, remark: "Recommanded daily Calories in kcal" },
    waterGoal: { type: Number, default: 0, remark: "daily Water intake Goal in cups" },
    createdTime: { type: Date, default: new Date() },
    webPushSubscriptions: {
        type: [webPushSchema],
        default: []
    }
    //updatedTime:{type:Date, default:new Date()},
});
exports.dailyEntriesModel = mongoose_1.default.model(dailyEntriesName, dailyEntriesSchema);
exports.userEntriesModel = mongoose_1.default.model(userName, userSchema);
exports.foodEntriesModel = mongoose_1.default.model(foodName, userSchema);
const authSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    salt: { type: Number, required: true },
    email: { type: String, required: true },
    hashpass: { type: String, required: true }
});
exports.authModel = mongoose_1.default.model(authName, authSchema);
