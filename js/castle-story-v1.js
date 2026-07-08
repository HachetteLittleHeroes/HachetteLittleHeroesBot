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

// ==========================================
// НАГРАДЫ (ЭЛЕМЕНТЫ КАСТОМИЗАЦИИ) ПО ХОДУ СЮЖЕТА
// ==========================================
const HIDDEN_REWARDS = {
    // Мистиq
    '2M_A_1': { type: 'random_border', lootKey: 'border', text: 'В награду путник отдал тебе все, что у него было' },
    '3M_2_2': { type: 'random_status_bg', lootKey: 'status_bg', text: 'Вы обнаружили красивый фон для статуса.' },
    '6M_1_3': { type: 'achetiki', lootKey: 'achetiki', text: 'Вы нашли кошелёк!' },
    // Воровка
    '2V_A_1': { type: 'random_status_bg', lootKey: 'status_bg', text: 'Вы наткнулись на фон для статуса.' },
    '4V_4_1': { type: 'achetiki', lootKey: 'achetiki', text: 'В тайнике вы нашли ашетики!' },
    '6V_1_1': { type: 'random_border', lootKey: 'border', text: 'Вы обнаружили обводку для профиля.' },
    // Алхимик
    '3A_4_1': { type: 'random_border', lootKey: 'border', text: 'Вы нашли обводку для профиля.' },
    '4A_5_1': { type: 'achetiki', lootKey: 'achetiki', text: 'Вы нашли ашетики.' },
    '6A_3_1': { type: 'random_status_bg', lootKey: 'status_bg', text: 'Вы нашли красивый фон для статуса.' }
};
