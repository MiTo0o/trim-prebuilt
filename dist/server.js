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
const scheduleNotification_1 = require("./scheduleNotification");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const connect_1 = __importDefault(require("./db/connect"));
const dotenv = __importStar(require("dotenv"));
const schema_models_1 = require("./db/schema.models");
const dayjs_1 = __importDefault(require("dayjs"));
const cors_1 = __importDefault(require("cors"));
dotenv.config();
dotenv.config();
const PORT = process.env.PORT || 8000;
(0, connect_1.default)();
(0, scheduleNotification_1.startSchedule)();
if (process.env.ENVIRONMENT !== 'DEV') {
    const { exec } = require("child_process");
    exec('sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8000', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: forwarding TCP port 80 to ${PORT}. ${stdout}`);
    });
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build")));
/**************** Utility Functions *************************/
app.post('/notifications/subscribe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = req.body;
    console.log('SUB', subscription);
    // add subscription to database
    let user = new schema_models_1.userEntriesModel({
        height: 1.7,
        weight: 60,
        firstName: "Spruce",
        lastName: "Ya",
        age: 20,
        caloriesGoal: 1500,
        waterGoal: 7,
        gender: "M",
        email: 'asd@fas.com',
        phoneNumber: 124123,
        webPushSubscriptions: [subscription]
    });
    yield user.save();
    res.status(200).json({ 'success': true });
}));
app.get('/getUserStreak', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('10');
}));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html"));
});
/*************** HISTORY / WEEKLY ROUTES ********************/
app.get("/api/getWeekly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const start = (0, dayjs_1.default)().subtract(7, "day");
    var query = {
        entryDate: {
            $gt: start.toISOString(),
            $lt: new Date(),
        },
        // user_id: {}, // Will need to be given the user_id by authentication middleware
    };
    try {
        let results = yield schema_models_1.dailyEntriesModel.find(query).limit(7).sort({ _id: -1 });
        if (results.length >= 1) {
            results.reverse();
            res.status(200);
            res.send(results);
        }
        else {
            throw new Error('data query failure');
        }
    }
    catch (error) {
        res.status(404);
        res.send(error.message);
    }
}));
/******************** Daily Get Route ***********************/
app.get('/api/daily', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
        entryDate: { $gte: (0, schema_models_1.todayMidnight)() },
        // user_id: String, // Will need to be given the user_id by authentication middleware
    };
    try {
        let result = yield schema_models_1.dailyEntriesModel.findOne(query).sort({ _id: -1 });
        res.status(200);
        res.send(result);
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}));
app.get('/api/latestEntry', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
    // user_id: String, // Will need to be given the user_id by authentication middleware
    };
    try {
        let result = yield schema_models_1.dailyEntriesModel.findOne(query).sort({ _id: -1 });
        res.status(200);
        res.send(result);
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}));
app.post('/api/daily', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
        entryDate: { $gte: (0, schema_models_1.todayMidnight)() },
        // user_id: String, // Will need to be given the user_id by authentication middleware
    };
    let payload = req.body;
    console.log(req.body);
    try {
        let result = yield schema_models_1.dailyEntriesModel.findOneAndUpdate(query, payload, {
            upsert: true,
            new: true
        });
        console.log(result);
        res.status(200);
        res.send(result);
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}));
app.get("/api/generateDaily", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('/api/generateDaily [params]: ', req.params);
    /**
     * Do something with req.params to configure advanced Data Generation
     */
    let foodItems = [];
    for (let i = 0; i < 5; i++) {
        foodItems.push({
            label: 'Big Mac',
            nutrients: {
                "ENERC_KCAL": 257,
                "PROCNT": 11.82,
                "FAT": 14.96,
                "CHOCDF": 20.08,
                "FIBTG": 1.6
            },
            wholeWeight: 213,
        });
    }
    let randData = [];
    const numDaysAgo = 10;
    for (let i = 0; i < numDaysAgo; i++) {
        var daily = {
            user_id: "62e99b03eccc7148176fcf85",
            foodItems,
            entryDate: (0, dayjs_1.default)().startOf('day').subtract(numDaysAgo - 1 - i, "day").toISOString(),
            waterAmount: Math.floor(Math.random() * 10),
            weightAmount: Math.floor(Math.random() * (150 - 40) + 40),
            caloriesAmount: Math.floor(Math.random() * (2200 - 3) + 3),
        };
        randData.push(daily);
    }
    try {
        yield schema_models_1.dailyEntriesModel.insertMany(randData);
        res.status(201);
        res.send({ message: `Generated ${numDaysAgo} random data entries!` });
    }
    catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err);
    }
}));
// Not sure what this is for......????
app.get("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = new schema_models_1.userEntriesModel({
        height: 1.7,
        weight: 60,
        firstName: "Spruce",
        lastName: "Ya",
        age: 20,
        caloriesGoal: 1500,
        waterGoal: 7,
        gender: "M",
        email: 'asd@fas.com',
        phoneNumber: 124123,
        webPushSubscriptions: [
            { endpoint: 'https://fcm.googleapis.com/fcm/send/dY2vomoPgS8:APA91bEqP3EsCkTlUwoE5WtZxE9SmJZJv3aBwMQWn4wkRgP5aRQU18AsbsNnp_RqYJuzK_gRkUuLuTEDDNqfgpY5tk4yQHqopjxRu2Y6VwsqvPPcS7q0E8dK2uGdhLnq_oOz4PpIcb3K',
                expirationTime: null,
                keys: {
                    p256dh: 'BMaslJakEW0Zu2o2mGhqjVB2XPTWQD67ird8EIfSy8pxMcuSyX6wm5AuvnKmM-5H1NWJ2BC5wmTHPAXljvQN2bI',
                    auth: 'wZxamv5cgcsv5UU04_plkw'
                }
            }
        ]
    });
    yield user.save();
    res.send({ message: "Hello" });
}));
app.post("/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = null;
    let username = req.body.username;
    console.log(username, 'usernaem');
    const query = {
        username: username
    };
    schema_models_1.authModel.find(query, (error, result) => {
        if (error)
            res.send('Failed');
        res.send(result);
    });
}));
app.post("/auth/checkUser", (req, res) => {
    // const data = null;
    let username = req.body.username;
    const query = {
        username: username
    };
    schema_models_1.authModel.find(query, (error, result) => {
        if (error)
            res.send('Failed');
        res.send(result);
    });
});
app.post("/auth/CreateUser", (req, res) => {
    // const data = null;
    console.log(req.body);
    let username = req.body.username;
    let email = req.body.email;
    let hashedFunction = req.body.hashedFunction;
    let salt = req.body.salt;
    console.log(username, salt, hashedFunction, email);
    const query = {
        username: username,
        email: email,
        salt: salt,
        hashpass: hashedFunction
    };
    const newAuthModel = new schema_models_1.authModel(query);
    newAuthModel.save().then((result) => {
        res.send(result);
    });
});
//Below is a post request for the users to register
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('req here:!!', req.body);
    let userData = req.body;
    userData.caloriesRecommanded = "2000";
    let userReg = new schema_models_1.userEntriesModel({
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: +userData.age,
        gender: userData.gender.value,
        email: userData.email,
        phoneNumber: +userData.phoneNumber,
        height: +userData.height,
        weight: +userData.weight,
        caloriesGoal: +userData.targetCalories,
        caloriesRecommanded: +userData.caloriesRecommanded,
        waterGoal: +userData.targetWater,
        createdTime: new Date(),
    });
    try {
        yield userReg.save();
        res.sendStatus(201);
    }
    catch (err) {
        res.status(501);
        res.send(err);
    }
}));
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
