/**
 * S8_RefreshPersistence — 页面刷新保持（来源：brief.md §1 S8）
 *
 * 数据场景：刷新后 GET 拉取，之前创建的事项仍在列表中。
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONTS, SPACING, SEED_TODOS, formatTime } from "../config";

export const S8_RefreshPersistence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.pageBg,
        fontFamily: FONTS.family,
      }}
    >
      {/* TODO: 实现刷新保持动画 */}
    </AbsoluteFill>
  );
};