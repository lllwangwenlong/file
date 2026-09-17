/**
 * S3_DetailedCreate — 创建含描述的事项（来源：brief.md §1 S3）
 *
 * 输入名称和描述，点击提交 → 列表追加条目，名称和描述均展示。
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONTS, SPACING } from "../config";

export const S3_DetailedCreate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.pageBg,
        fontFamily: FONTS.family,
      }}
    >
      {/* TODO: 实现含描述创建动画 */}
    </AbsoluteFill>
  );
};