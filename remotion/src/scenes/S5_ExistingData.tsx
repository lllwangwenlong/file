/**
 * S5_ExistingData — 访问已有数据的列表（来源：brief.md §1 S5）
 *
 * 数据场景：页面加载自动拉取，按创建时间倒序展示。
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONTS, SPACING, SEED_TODOS, formatTime } from "../config";

export const S5_ExistingData: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.pageBg,
        fontFamily: FONTS.family,
      }}
    >
      {/* TODO: 实现已有数据列表动画 */}
    </AbsoluteFill>
  );
};