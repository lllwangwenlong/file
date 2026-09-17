/**
 * S7_BackendDegraded — 后端不可用降级（来源：brief.md §1 S7）
 *
 * 后端未启动时：GET 静默失败不阻断 UI，创建时弹出友好错误提示。
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONTS, SPACING } from "../config";

export const S7_BackendDegraded: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.pageBg,
        fontFamily: FONTS.family,
      }}
    >
      {/* TODO: 实现后端降级错误提示动画 */}
    </AbsoluteFill>
  );
};