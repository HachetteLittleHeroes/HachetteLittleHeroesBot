// ==========================================
// ПЕРЕМЕННЫЕ ЗАМКА
// ==========================================

let castleStartTime = null;
let selectedCastleCharacter = null;
let currentEndingClaimed = false;
let userCastleStats = { strength: 0, agility: 0, intelligence: 0 };
let currentCastleCard = null;
let castleCompletedEndings = [];
let castleCompletedChoices = {};
let castleApprovedChoices = {};
let metEliza = false;
let kissedAdelaide = false;
let visitedZibeef = false;
let castleLootCache = {};

// ==========================================
// ШАНСЫ ВЫПАДЕНИЯ СТАТУСА
// ==========================================

const STATUS_DROP_CHANCE = {
    normal: 1.00,
    secret: 1.00
};
