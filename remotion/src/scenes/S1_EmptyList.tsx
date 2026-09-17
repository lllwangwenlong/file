/**
 * S1_EmptyList — 首次访问空列表（来源：brief.md §1 S1）
 *
 * 数据场景：引用 config.ts 中的 SEED_TODOS / RESOURCES.verifiedData
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { COLORS, FONTS, SPACING } from "../config";

export const S1_EmptyList: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.pageBg,
        fontFamily: FONTS.family,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: SPACING.pageMaxWidth,
          padding: SPACING.cardPadding,
          backgroundColor: COLORS.bgWhite,
          borderRadius: SPACING.cardRadius,
          boxShadow: COLORS.cardShadow,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: FONTS.title.size,
            fontWeight: FONTS.title.weight,
            color: COLORS.textPrimary,
            marginBottom: 16,
          }}
        >
          待办事项列表（共 0 项）
        </h2>
        <p
          style={{
            fontSize: FONTS.auxiliary.size,
            color: COLORS.textWeak,
          }}
        >
          暂无待办事项，请在上方添加。
        </p>
      </div>
    </AbsoluteFill>
  );
};