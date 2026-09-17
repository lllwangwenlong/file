/**
 * S2_QuickCreate — 快速创建事项（来源：brief.md §1 S2）
 *
 * 仅填名称，描述留空，回车提交 → 列表即时追加。
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONTS, SPACING } from "../config";

export const S2_QuickCreate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.pageBg,
        fontFamily: FONTS.family,
      }}
    >
      {/* TODO: 实现快速创建动画 */}
    </AbsoluteFill>
  );
};