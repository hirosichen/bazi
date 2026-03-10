/**
 * 八字命理計算引擎
 * Four Pillars of Destiny (Bazi) Calculation Engine
 */

// 天干 Heavenly Stems
export const HEAVENLY_STEMS = [
  { index: 0, name: '甲', pinyin: 'jiǎ', element: '木', yinYang: '陽', color: '#2d8a56' },
  { index: 1, name: '乙', pinyin: 'yǐ', element: '木', yinYang: '陰', color: '#3da868' },
  { index: 2, name: '丙', pinyin: 'bǐng', element: '火', yinYang: '陽', color: '#c44d4d' },
  { index: 3, name: '丁', pinyin: 'dīng', element: '火', yinYang: '陰', color: '#d4756b' },
  { index: 4, name: '戊', pinyin: 'wù', element: '土', yinYang: '陽', color: '#c49a2a' },
  { index: 5, name: '己', pinyin: 'jǐ', element: '土', yinYang: '陰', color: '#d4a84c' },
  { index: 6, name: '庚', pinyin: 'gēng', element: '金', yinYang: '陽', color: '#8a8a96' },
  { index: 7, name: '辛', pinyin: 'xīn', element: '金', yinYang: '陰', color: '#a8a8b4' },
  { index: 8, name: '壬', pinyin: 'rén', element: '水', yinYang: '陽', color: '#3d7ab8' },
  { index: 9, name: '癸', pinyin: 'guǐ', element: '水', yinYang: '陰', color: '#6ba3d6' },
] as const;

// 地支 Earthly Branches
export const EARTHLY_BRANCHES = [
  { index: 0, name: '子', pinyin: 'zǐ', element: '水', yinYang: '陽', animal: '鼠', hours: '23:00-01:00', month: 11 },
  { index: 1, name: '丑', pinyin: 'chǒu', element: '土', yinYang: '陰', animal: '牛', hours: '01:00-03:00', month: 12 },
  { index: 2, name: '寅', pinyin: 'yín', element: '木', yinYang: '陽', animal: '虎', hours: '03:00-05:00', month: 1 },
  { index: 3, name: '卯', pinyin: 'mǎo', element: '木', yinYang: '陰', animal: '兔', hours: '05:00-07:00', month: 2 },
  { index: 4, name: '辰', pinyin: 'chén', element: '土', yinYang: '陽', animal: '龍', hours: '07:00-09:00', month: 3 },
  { index: 5, name: '巳', pinyin: 'sì', element: '火', yinYang: '陰', animal: '蛇', hours: '09:00-11:00', month: 4 },
  { index: 6, name: '午', pinyin: 'wǔ', element: '火', yinYang: '陽', animal: '馬', hours: '11:00-13:00', month: 5 },
  { index: 7, name: '未', pinyin: 'wèi', element: '土', yinYang: '陰', animal: '羊', hours: '13:00-15:00', month: 6 },
  { index: 8, name: '申', pinyin: 'shēn', element: '金', yinYang: '陽', animal: '猴', hours: '15:00-17:00', month: 7 },
  { index: 9, name: '酉', pinyin: 'yǒu', element: '金', yinYang: '陰', animal: '雞', hours: '17:00-19:00', month: 8 },
  { index: 10, name: '戌', pinyin: 'xū', element: '土', yinYang: '陽', animal: '狗', hours: '19:00-21:00', month: 9 },
  { index: 11, name: '亥', pinyin: 'hài', element: '水', yinYang: '陰', animal: '豬', hours: '21:00-23:00', month: 10 },
] as const;

// 五行 Five Elements
export const FIVE_ELEMENTS = {
  '木': { name: '木', english: 'Wood', color: '#2d8a56', generates: '火', controls: '土', icon: '🌳' },
  '火': { name: '火', english: 'Fire', color: '#c44d4d', generates: '土', controls: '金', icon: '🔥' },
  '土': { name: '土', english: 'Earth', color: '#c49a2a', generates: '金', controls: '水', icon: '⛰️' },
  '金': { name: '金', english: 'Metal', color: '#8a8a96', generates: '水', controls: '木', icon: '⚔️' },
  '水': { name: '水', english: 'Water', color: '#3d7ab8', generates: '木', controls: '火', icon: '💧' },
} as const;

// 十神 Ten Gods
export const TEN_GODS: Record<string, { name: string; meaning: string }> = {
  '比肩': { name: '比肩', meaning: '同類相助，獨立自主' },
  '劫財': { name: '劫財', meaning: '競爭意識，冒險進取' },
  '食神': { name: '食神', meaning: '才華表現，享受生活' },
  '傷官': { name: '傷官', meaning: '創意突破，反傳統' },
  '偏財': { name: '偏財', meaning: '意外之財，靈活經商' },
  '正財': { name: '正財', meaning: '穩定收入，勤儉持家' },
  '七殺': { name: '七殺', meaning: '權力魄力，挑戰自我' },
  '正官': { name: '正官', meaning: '正直守規，領導才能' },
  '偏印': { name: '偏印', meaning: '特殊才華，獨特思維' },
  '正印': { name: '正印', meaning: '學術智慧，貴人相助' },
};

// 納音 Nayin (60 Jiazi cycle sounds)
const NAYIN = [
  '海中金', '海中金', '爐中火', '爐中火', '大林木', '大林木',
  '路旁土', '路旁土', '劍鋒金', '劍鋒金', '山頭火', '山頭火',
  '澗下水', '澗下水', '城頭土', '城頭土', '白蠟金', '白蠟金',
  '楊柳木', '楊柳木', '泉中水', '泉中水', '屋上土', '屋上土',
  '霹靂火', '霹靂火', '松柏木', '松柏木', '長流水', '長流水',
  '砂中金', '砂中金', '山下火', '山下火', '平地木', '平地木',
  '壁上土', '壁上土', '金箔金', '金箔金', '覆燈火', '覆燈火',
  '天河水', '天河水', '大驛土', '大驛土', '釵釧金', '釵釧金',
  '桑柘木', '桑柘木', '大溪水', '大溪水', '沙中土', '沙中土',
  '天上火', '天上火', '石榴木', '石榴木', '大海水', '大海水',
];

// 節氣 Solar Terms for month pillar calculation
// Each entry: [month, day] approximate start of each solar term
const SOLAR_TERMS: [number, number][] = [
  [2, 4],   // 立春 Start of Spring (month 1)
  [3, 6],   // 驚蟄 Awakening of Insects (month 2)
  [4, 5],   // 清明 Clear and Bright (month 3)
  [5, 6],   // 立夏 Start of Summer (month 4)
  [6, 6],   // 芒種 Grain in Ear (month 5)
  [7, 7],   // 小暑 Slight Heat (month 6)
  [8, 7],   // 立秋 Start of Autumn (month 7)
  [9, 8],   // 白露 White Dew (month 8)
  [10, 8],  // 寒露 Cold Dew (month 9)
  [11, 7],  // 立冬 Start of Winter (month 10)
  [12, 7],  // 大雪 Major Snow (month 11)
  [1, 6],   // 小寒 Slight Cold (month 12)
];

export interface Pillar {
  stem: typeof HEAVENLY_STEMS[number];
  branch: typeof EARTHLY_BRANCHES[number];
  nayin: string;
}

export interface BaziChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: typeof HEAVENLY_STEMS[number];
  fiveElements: Record<string, number>;
  tenGods: { pillar: string; god: string }[];
  animal: string;
  napilar: string;
  birthDate: string;
  birthHour: number;
  gender: 'male' | 'female';
}

/**
 * Get the lunar month index (0-11) based on solar date and solar terms
 */
function getLunarMonthIndex(month: number, day: number): number {
  // Solar terms mark the beginning of each lunar month
  // We need to check which solar term period the date falls in
  for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
    const [termMonth, termDay] = SOLAR_TERMS[i];
    if (month > termMonth || (month === termMonth && day >= termDay)) {
      return (i + 2) % 12; // Adjusted to earthly branch index (寅=2 for month 1)
    }
  }
  return 1; // 丑 month (before 立春)
}

/**
 * Calculate year pillar using the traditional stem-branch cycle
 * Year starts from 立春 (Start of Spring, ~Feb 4)
 */
function getYearPillar(year: number, month: number, day: number): Pillar {
  // Adjust year if before 立春
  let adjustedYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    adjustedYear -= 1;
  }

  // 1984 is 甲子年 (stem=0, branch=0)
  const offset = adjustedYear - 1984;
  const stemIndex = ((offset % 10) + 10) % 10;
  const branchIndex = ((offset % 12) + 12) % 12;
  const jiazi = ((offset % 60) + 60) % 60;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    nayin: NAYIN[jiazi],
  };
}

/**
 * Calculate month pillar
 * Month stem is derived from year stem using the 五虎遁月 rule
 */
function getMonthPillar(yearStemIndex: number, month: number, day: number): Pillar {
  const lunarMonthBranchIndex = getLunarMonthIndex(month, day);

  // 五虎遁月 rule: year stem determines the starting month stem
  // 甲己年起丙寅，乙庚年起戊寅，丙辛年起庚寅，丁壬年起壬寅，戊癸年起甲寅
  const monthStemStart = [2, 4, 6, 8, 0]; // Starting stem for 寅 month
  const yearGroup = yearStemIndex % 5;
  const monthsFromYin = (lunarMonthBranchIndex - 2 + 12) % 12;
  const stemIndex = (monthStemStart[yearGroup] + monthsFromYin) % 10;

  const jiazi = ((stemIndex * 6 + lunarMonthBranchIndex) % 60 + 60) % 60;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[lunarMonthBranchIndex],
    nayin: NAYIN[jiazi % 60],
  };
}

/**
 * Calculate day pillar using the formula
 * Reference: 2000-01-01 is 戊午日 (stem=4, branch=6)
 */
function getDayPillar(year: number, month: number, day: number): Pillar {
  // Calculate Julian Day Number
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Reference: JDN for 2000-01-01 = 2451545, which is 戊午 (stem=4, branch=6)
  const refJdn = 2451545;
  const diff = jdn - refJdn;

  const stemIndex = ((4 + diff) % 10 + 10) % 10;
  const branchIndex = ((6 + diff) % 12 + 12) % 12;
  const jiazi = ((diff % 60) + 60) % 60;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    nayin: NAYIN[((jiazi + 4 * 6 + 6) % 60 + 60) % 60],
  };
}

/**
 * Calculate hour pillar
 * Hour stem is derived from day stem using the 五鼠遁時 rule
 */
function getHourPillar(dayStemIndex: number, hour: number): Pillar {
  // Convert 24h to branch index
  // 子時: 23-1, 丑時: 1-3, 寅時: 3-5, ...
  let branchIndex: number;
  if (hour >= 23 || hour < 1) branchIndex = 0;      // 子
  else if (hour < 3) branchIndex = 1;                 // 丑
  else if (hour < 5) branchIndex = 2;                 // 寅
  else if (hour < 7) branchIndex = 3;                 // 卯
  else if (hour < 9) branchIndex = 4;                 // 辰
  else if (hour < 11) branchIndex = 5;                // 巳
  else if (hour < 13) branchIndex = 6;                // 午
  else if (hour < 15) branchIndex = 7;                // 未
  else if (hour < 17) branchIndex = 8;                // 申
  else if (hour < 19) branchIndex = 9;                // 酉
  else if (hour < 21) branchIndex = 10;               // 戌
  else branchIndex = 11;                               // 亥

  // 五鼠遁時 rule
  // 甲己日起甲子，乙庚日起丙子，丙辛日起戊子，丁壬日起庚子，戊癸日起壬子
  const hourStemStart = [0, 2, 4, 6, 8];
  const dayGroup = dayStemIndex % 5;
  const stemIndex = (hourStemStart[dayGroup] + branchIndex) % 10;

  const jiazi = ((stemIndex * 6 + branchIndex) % 60 + 60) % 60;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    nayin: NAYIN[jiazi % 60],
  };
}

/**
 * Calculate Five Elements balance
 */
function calculateFiveElements(pillars: Pillar[]): Record<string, number> {
  const count: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  for (const p of pillars) {
    count[p.stem.element]++;
    count[p.branch.element]++;
  }
  return count;
}

/**
 * Determine the Ten God relationship between two stems
 */
function getTenGod(dayStem: typeof HEAVENLY_STEMS[number], otherStem: typeof HEAVENLY_STEMS[number]): string {
  const elements = ['木', '火', '土', '金', '水'];
  const dayIdx = elements.indexOf(dayStem.element);
  const otherIdx = elements.indexOf(otherStem.element);
  const samePolarity = dayStem.yinYang === otherStem.yinYang;

  if (dayIdx === otherIdx) {
    return samePolarity ? '比肩' : '劫財';
  }

  const generates = (dayIdx + 1) % 5; // 我生
  const controls = (dayIdx + 2) % 5;  // 我剋
  const generatedBy = (dayIdx + 4) % 5; // 生我
  const controlledBy = (dayIdx + 3) % 5; // 剋我

  if (otherIdx === generates) return samePolarity ? '食神' : '傷官';
  if (otherIdx === controls) return samePolarity ? '偏財' : '正財';
  if (otherIdx === controlledBy) return samePolarity ? '七殺' : '正官';
  if (otherIdx === generatedBy) return samePolarity ? '偏印' : '正印';

  return '比肩';
}

/**
 * Main function: Calculate the complete Bazi chart
 */
export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female' = 'male'
): BaziChart {
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(yearPillar.stem.index, month, day);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar.stem.index, hour);

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const fiveElements = calculateFiveElements(pillars);

  const dayMaster = dayPillar.stem;

  // Calculate Ten Gods for each pillar
  const pillarNames = ['年柱', '月柱', '日柱', '時柱'];
  const tenGods = pillars.map((p, i) => ({
    pillar: pillarNames[i],
    god: i === 2 ? '日主' : getTenGod(dayMaster, p.stem),
  }));

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster,
    fiveElements,
    tenGods,
    animal: yearPillar.branch.animal,
    napilar: dayPillar.nayin,
    birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    birthHour: hour,
    gender,
  };
}

/**
 * Format a pillar as a display string
 */
export function formatPillar(pillar: Pillar): string {
  return `${pillar.stem.name}${pillar.branch.name}`;
}

/**
 * Get a summary of the Bazi chart
 */
export function getBaziSummary(chart: BaziChart): string {
  const lines: string[] = [];
  lines.push(`出生日期：${chart.birthDate} ${chart.birthHour}時`);
  lines.push(`性別：${chart.gender === 'male' ? '男' : '女'}`);
  lines.push('');
  lines.push(`年柱：${formatPillar(chart.year)}（${chart.year.nayin}）`);
  lines.push(`月柱：${formatPillar(chart.month)}（${chart.month.nayin}）`);
  lines.push(`日柱：${formatPillar(chart.day)}（${chart.day.nayin}）— 日主`);
  lines.push(`時柱：${formatPillar(chart.hour)}（${chart.hour.nayin}）`);
  lines.push('');
  lines.push(`日主：${chart.dayMaster.name}（${chart.dayMaster.element}）`);
  lines.push(`生肖：${chart.animal}`);
  lines.push('');
  lines.push('五行分布：');
  for (const [element, count] of Object.entries(chart.fiveElements)) {
    lines.push(`  ${element}：${count}`);
  }
  lines.push('');
  lines.push('十神：');
  for (const tg of chart.tenGods) {
    lines.push(`  ${tg.pillar}：${tg.god}`);
  }
  return lines.join('\n');
}

/**
 * Analyze Five Elements balance and provide insight
 */
export function analyzeElements(chart: BaziChart): {
  strong: string[];
  weak: string[];
  missing: string[];
  advice: string;
} {
  const strong: string[] = [];
  const weak: string[] = [];
  const missing: string[] = [];

  for (const [element, count] of Object.entries(chart.fiveElements)) {
    if (count === 0) missing.push(element);
    else if (count >= 3) strong.push(element);
    else if (count === 1) weak.push(element);
  }

  const dayElement = chart.dayMaster.element;
  const dayCount = chart.fiveElements[dayElement];
  let advice = '';

  if (dayCount >= 3) {
    advice = `日主${chart.dayMaster.name}（${dayElement}）偏旺，建議以洩耗為用。`;
  } else if (dayCount <= 1) {
    advice = `日主${chart.dayMaster.name}（${dayElement}）偏弱，建議以生扶為用。`;
  } else {
    advice = `日主${chart.dayMaster.name}（${dayElement}）中和，命局較為平衡。`;
  }

  return { strong, weak, missing, advice };
}
