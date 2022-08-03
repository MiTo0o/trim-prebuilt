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
exports.startSchedule = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const web_push_1 = __importDefault(require("web-push"));
const dotenv = __importStar(require("dotenv"));
const connect_1 = __importDefault(require("./db/connect"));
const schema_models_1 = require("./db/schema.models");
dotenv.config();
web_push_1.default.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);
// loop through all subscript and process/send out custom notifications
function startSchedule() {
    const job = node_schedule_1.default.scheduleJob('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
        yield (0, connect_1.default)();
        const allUsers = yield schema_models_1.userEntriesModel.find();
        for (const user of allUsers) {
            const subscriptions = user['webPushSubscriptions'];
            if (subscriptions.length > 0) {
                const message = yield getUserResultsFromYesterday(user._id, user.caloriesGoal);
                if (message === null) {
                    continue;
                }
                const payload = JSON.stringify({
                    title: 'Daily Goals',
                    description: message
                });
                for (const subscription of subscriptions) {
                    // in the case of invalid/expired subscriptions
                    try {
                        yield web_push_1.default.sendNotification(subscription, payload);
                    }
                    catch (e) {
                        continue;
                    }
                }
            }
        }
    }));
}
exports.startSchedule = startSchedule;
;
function getUserResultsFromYesterday(userId, userCalorieGoal) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            user_id: userId
        };
        const userEntryYesterday = yield schema_models_1.dailyEntriesModel.findOne(query).sort({ _id: -1 });
        try {
            const caloriesConsumedYesterday = userEntryYesterday['caloriesAmount'];
            const diff = Math.abs(caloriesConsumedYesterday - userCalorieGoal);
            if (diff <= 50) {
                return 'Congrats on hitting your goal yesterday!! Keep it up!';
            }
            else {
                return 'Looks like you missed your goal yesterday. Let\'s give it another try today!';
            }
        }
        catch (e) {
            return null;
        }
    });
}
