/**
 * Root.tsx — Remotion 根组件
 *
 * 注册所有场景 Composition，每个场景引用 src/config.ts 中定义的
 * 统一品牌色 / 字体 / 时长配置。
 * 数据类场景通过 config.ts 间接引用 verified_data.json。
 */

import { Composition } from "remotion";
import { FPS, SCENES } from "./config";

import { S1_EmptyList } from "./scenes/S1_EmptyList";
import { S2_QuickCreate } from "./scenes/S2_QuickCreate";
import { S3_DetailedCreate } from "./scenes/S3_DetailedCreate";
import { S4_ContinuousCreate } from "./scenes/S4_ContinuousCreate";
import { S5_ExistingData } from "./scenes/S5_ExistingData";
import { S6_EmptyNameValidation } from "./scenes/S6_EmptyNameValidation";
import { S7_BackendDegraded } from "./scenes/S7_BackendDegraded";
import { S8_RefreshPersistence } from "./scenes/S8_RefreshPersistence";

export const Root: React.FC = () => {
  return (
    <>
      {SCENES.map((scene) => (
        <Composition
          key={scene.id}
          id={scene.id}
          component={getSceneComponent(scene.id)}
          durationInFrames={scene.durationInFrames}
          fps={FPS}
          width={720}
          height={480}
          defaultProps={{}}
        />
      ))}
    </>
  );
};

/** 将场景 id 映射到对应的 React 组件 */
function getSceneComponent(id: string): React.FC {
  const map: Record<string, React.FC> = {
    S1_EmptyList,
    S2_QuickCreate,
    S3_DetailedCreate,
    S4_ContinuousCreate,
    S5_ExistingData,
    S6_EmptyNameValidation,
    S7_BackendDegraded,
    S8_RefreshPersistence,
  };
  return map[id];
}