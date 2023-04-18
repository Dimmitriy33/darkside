import { useState } from "react";
import cx from "classnames";
import "./tabs.module.scss";

export interface ITabEl {
  label: string;
  onClick?: () => void | Promise<unknown>;
}

export interface TabProps {
  startIndex?: number;
  items: {
    label: string;
    onClick: () => void;
  }[];
  className?: string;
}

export default function Tabs(props: TabProps) {
  const { items, className, startIndex } = props;
  const [activeTabIndex, setActiveTabIndex] = useState(startIndex || 0);

  const renderTabs = () =>
    items.map((v, i) => (
      <button
        key={v.label}
        type="button"
        className={cx(["tab", i === activeTabIndex ? "active" : null])}
        onClick={() => {
          setActiveTabIndex(i);
          v.onClick && v.onClick();
        }}
      >
        {v.label}
      </button>
    ));

  return <div className={cx(["tabs", className])}>{renderTabs()}</div>;
}
