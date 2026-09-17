/**
 * config.ts — Remotion 项目单一真相源
 *
 * 所有品牌色、字体、场景时长、资源路径均在这里统一定义。
 * 数据来源：brief.md §3 视觉规范 + §2 时长分布。
 */

import verifiedData from "../verified_data.json";

// ============================================================
// 1. 色彩系统（来源：brief.md §3.2）
// ============================================================

export const COLORS = {
  /** 主操作色 — Element UI 经典蓝 #409eff */
  primary: "#409eff",
  /** 主操作色 Hover — 深 1 档 #337ecc */
  primaryHover: "#337ecc",
  /** 主操作色 Disabled — 浅蓝 #a0cfff */
  primaryDisabled: "#a0cfff",

  /** 文字主色 — 标题、事项名称 #333333 */
  textPrimary: "#333333",
  /** 文字辅色 — 表单标签 #555555 */
  textSecondary: "#555555",
  /** 文字次辅色 — 描述文本 #777777 */
  textTertiary: "#777777",
  /** 文字弱色 — 计数、空状态 #999999 */
  textWeak: "#999999",
  /** 时间戳色 #bbbbbb */
  timestamp: "#bbbbbb",

  /** 错误色 — 校验错误文字、必填星号 #e74c3c */
  error: "#e74c3c",

  /** 背景白 — 卡片背景 #ffffff */
  bgWhite: "#ffffff",
  /** 分割线 — 列表项分隔 #f0f0f0 */
  divider: "#f0f0f0",
  /** 输入框边框 — 默认 #dddddd */
  inputBorder: "#dddddd",
  /** 输入框聚焦 — 与主操作色统一 #409eff */
  inputFocus: "#409eff",

  /** 卡片阴影 */
  cardShadow: "0 1px 4px rgba(0,0,0,0.08)",

  /** 页面背景 */
  pageBg: "#f5f6f8",
} as const;

// ============================================================
// 2. 字体层级（来源：brief.md §3.3）
// ============================================================

export const FONTS = {
  /** 系统字体栈 */
  family: `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif`,

  /** H2 标题 — 18px / 400 */
  title: { size: 18, weight: 400 },
  /** 事项名称 — 15px / 600 */
  itemName: { size: 15, weight: 600 },
  /** 正文 / 表单标签 — 14px / 400 */
  body: { size: 14, weight: 400 },
  /** 描述文本 — 13px / 400 */
  description: { size: 13, weight: 400 },
  /** 辅助信息 — 12px / 400 */
  auxiliary: { size: 12, weight: 400 },
} as const;

// ============================================================
// 3. 间距与尺寸（来源：brief.md §3.4）
// ============================================================

export const SPACING = {
  pageMaxWidth: 720,
  pageHorizontalPadding: 16,
  pageVerticalPadding: 32,
  cardPadding: 24,
  cardGap: 24,
  formGroupGap: 14,
  labelInputGap: 6,
  listItemPadding: "14px 16px",
  inputPadding: "10px 12px",
  buttonPadding: "10px 32px",
  cardRadius: 8,
  inputRadius: 4,
} as const;

// ============================================================
// 4. 场景时长（来源：brief.md §2.1，单位：秒）
//    Remotion 使用帧数，帧率 30fps
// ============================================================

export const FPS = 30;

const toFrames = (seconds: number) => Math.round(seconds * FPS);

export const SCENE_DURATIONS = {
  /** S1 首次空列表 — 1.3s */
  S1_EmptyList: toFrames(1.3),
  /** S2 快速创建 — 3.4s */
  S2_QuickCreate: toFrames(3.4),
  /** S3 含描述创建 — 8.2s */
  S3_DetailedCreate: toFrames(8.2),
  /** S4 连续创建 — 6.4s（2 条连续） */
  S4_ContinuousCreate: toFrames(6.4),
  /** S5 已有数据访问 — 2.3s */
  S5_ExistingData: toFrames(2.3),
  /** S6 空名校验 — 1.0s */
  S6_EmptyNameValidation: toFrames(1.0),
  /** S7 后端降级 — 1.5s */
  S7_BackendDegraded: toFrames(1.5),
  /** S8 刷新保持 — 1.3s */
  S8_RefreshPersistence: toFrames(1.3),
} as const;

// ============================================================
// 5. 场景元信息（来源：brief.md §1 + §4）
// ============================================================

export interface SceneMeta {
  id: string;
  name: string;
  durationInFrames: number;
  category: "core" | "auxiliary" | "edge";
}

export const SCENES: SceneMeta[] = [
  {
    id: "S1_EmptyList",
    name: "首次访问空列表",
    durationInFrames: SCENE_DURATIONS.S1_EmptyList,
    category: "edge",
  },
  {
    id: "S2_QuickCreate",
    name: "快速创建事项",
    durationInFrames: SCENE_DURATIONS.S2_QuickCreate,
    category: "core",
  },
  {
    id: "S3_DetailedCreate",
    name: "创建含描述的事项",
    durationInFrames: SCENE_DURATIONS.S3_DetailedCreate,
    category: "core",
  },
  {
    id: "S4_ContinuousCreate",
    name: "创建后继续添加",
    durationInFrames: SCENE_DURATIONS.S4_ContinuousCreate,
    category: "core",
  },
  {
    id: "S5_ExistingData",
    name: "访问已有数据的列表",
    durationInFrames: SCENE_DURATIONS.S5_ExistingData,
    category: "auxiliary",
  },
  {
    id: "S6_EmptyNameValidation",
    name: "名称为空校验",
    durationInFrames: SCENE_DURATIONS.S6_EmptyNameValidation,
    category: "edge",
  },
  {
    id: "S7_BackendDegraded",
    name: "后端不可用降级",
    durationInFrames: SCENE_DURATIONS.S7_BackendDegraded,
    category: "edge",
  },
  {
    id: "S8_RefreshPersistence",
    name: "页面刷新保持",
    durationInFrames: SCENE_DURATIONS.S8_RefreshPersistence,
    category: "edge",
  },
];

// ============================================================
// 6. 资源路径
// ============================================================

export const RESOURCES = {
  /** 已校验的数据素材 */
  verifiedData: verifiedData,
  /** verified_data.json 原始路径 */
  verifiedDataPath: "../verified_data.json",
} as const;

// ============================================================
// 7. 演示种子数据（来源：brief.md §5.4）
// ============================================================

export const SEED_TODOS = [
  {
    id: 1,
    name: "完成 Q3 季度报告",
    description: "包含收入、成本、利润三部分分析，周五前提交",
    createdAt: "2026-09-17T02:30:00.000Z",
  },
  {
    id: 2,
    name: "预约牙医",
    description: "市口腔医院，电话 021-xxxxxxx",
    createdAt: "2026-09-17T03:00:00.000Z",
  },
  {
    id: 3,
    name: "整理周会纪要",
    description: "9月15日会议记录，发给全组",
    createdAt: "2026-09-17T04:15:00.000Z",
  },
  {
    id: 4,
    name: "更新项目 README",
    description: "补充部署文档和 API 说明",
    createdAt: "2026-09-17T05:00:00.000Z",
  },
];

/**
 * 格式化 ISO 时间戳为 "YYYY-MM-DD HH:mm"（来源：brief.md §5.3）
 */
export function formatTime(isoStr: string): string {
  const d = new Date(isoStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}