/**
 * index.ts — Remotion 入口
 *
 * registerRoot() 是 Remotion 要求的唯一入口点调用。
 */

import { registerRoot } from "remotion";
import { Root } from "./Root";

registerRoot(Root);