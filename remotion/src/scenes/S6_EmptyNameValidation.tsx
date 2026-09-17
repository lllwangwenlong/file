/**
 * S6_EmptyNameValidation — 名称为空校验（来源：brief.md §1 S6）
 *
 * 未填名称直接提交 → 前端阻止，显示「事项名称不能为空」。
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONTS, SPACING } from "../config";

export const S6_EmptyNameValidation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.pageBg,
        fontFamily: FONTS.family,
      }}
    >
      {/* TODO: 实现名校验错误提示动画 */}
    </AbsoluteFill>
  );
};