"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = __importStar(require("../../plugin"));
class Bag extends plugin_1.default {
    constructor() {
        super();
        this.name = '包裹道具';
        this.description = '领取直播包裹道具';
        this.version = '0.0.1';
        this.author = 'lzghzr';
        this._getBagList = new Map();
    }
    async load({ defaultOptions, whiteList }) {
        defaultOptions.newUserData['getBag'] = false;
        defaultOptions.info['getBag'] = {
            description: '包裹道具',
            tip: '领取直播包裹道具',
            type: 'boolean'
        };
        whiteList.add('getBag');
        this.loaded = true;
    }
    async start({ users }) {
        this._getBag(users);
    }
    async loop({ cstMin, cstHour, cstString, users }) {
        if (cstString === '00:10')
            this._getBagList.clear();
        if (cstMin === 30 && cstHour % 8 === 4)
            this._getBag(users);
    }
    _getBag(users) {
        users.forEach(async (user, uid) => {
            if (this._getBagList.get(uid) || !user.userData['getBag'])
                return;
            const getBag = {
                uri: `https://api.live.bilibili.com/AppBag/getSendGift?${plugin_1.AppClient.signQueryBase(user.tokenQuery)}`,
                json: true,
                headers: user.headers
            };
            const getBagGift = await plugin_1.tools.XHR(getBag, 'Android');
            if (getBagGift !== undefined && getBagGift.response.statusCode === 200) {
                if (getBagGift.body.code === 0) {
                    this._getBagList.set(uid, true);
                    plugin_1.tools.Log(user.nickname, '包裹道具', '已获取每日包裹道具');
                }
                else
                    plugin_1.tools.Log(user.nickname, '包裹道具', getBagGift.body);
            }
            else
                plugin_1.tools.Log(user.nickname, '包裹道具', '网络错误');
        });
    }
}
exports.default = new Bag();
