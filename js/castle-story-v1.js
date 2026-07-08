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

// ==========================================
// СТАТУСЫ ЗА РАЗНЫЕ КОНЦОВКИ
// ==========================================
const ENDING_REWARDS = {
    // Мистий — хорошие концовки
    'mystic_hero_lore': { status: 'Герой Ашетвиля', statusChance: 'normal' },
    'mystic_hero_arena': { status: 'Чемпион арены', statusChance: 'normal' },
    'mystic_hero_ally': { status: 'Верный союзник', statusChance: 'normal' },
    
    // Мистий — король
    'mystic_king_chosen': { status: 'Избранный замком', statusChance: 'normal' },
    'mystic_king_tournament': { status: 'Король по праву', statusChance: 'normal' },
    
    // Мистий — плохие концовки
    'mystic_cursed': { status: 'Проклятый король', statusChance: 'normal' },
    'mystic_servant': { status: 'Призрачный слуга', statusChance: 'normal' },
    'mystic_prisoner': { status: 'Узник замка', statusChance: 'normal' },
    'mystic_dead': { status: 'Павший воин', statusChance: 'normal' },
    
    // Мистий — особые
    'mystic_love': { status: 'Возлюбленная', statusChance: 'secret' },
    'mystic_zibeef': { status: 'Друг мельника', statusChance: 'normal' },
    
    // Воровка
    'thief_hero': { status: 'Глава Гильдии', statusChance: 'normal' },
    'thief_queen': { status: 'Королева теней', statusChance: 'normal' },
    'thief_free': { status: 'Свободная душа', statusChance: 'secret' },
    
    // Алхимик
    'alchemist_archmage': { status: 'Архимаг', statusChance: 'normal' },
    'alchemist_keeper': { status: 'Хранитель знаний', statusChance: 'normal' },
    'alchemist_true': { status: 'Познавший тайну', statusChance: 'secret' },
};
