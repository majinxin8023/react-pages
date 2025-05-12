/**
 * 页面Loading组件 
 * bgOpacity 改变背景色
 */
import React, { FC, ReactNode } from "react";
import "./style.css";

type props = {
  children?: ReactNode;
  bgOpacity?: Boolean;
};
const Loading: FC<props> = ({ bgOpacity = true }) => {
  return (
    <>
      <div
        className={`components-loading ${bgOpacity ? "components-loading-opacity" : ""
          }`}
      >
        <div className="loading-con">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  );
};

export default Loading;