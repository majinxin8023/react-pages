import React, { lazy, LazyExoticComponent } from "react";

export namespace SyncRoute {
  export type Routes = {
    path: string;
    element: LazyExoticComponent<any>;
    children?: Routes[];
  };
}
/**
 * 页面路由
 * path 路径
 * element 页面路径
 * children 子路由
 */
export const Routes: SyncRoute.Routes[] = [
  {
    path: "/",
    element: lazy(() => import("@pages/Home")),
  },
];
