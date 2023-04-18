/* eslint-disable react/sort-comp */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import cx from "classnames";
import memoize from "memoize-one";
import { Component } from "react";
import remove from "ytech-js-extensions/lib/array/remove";
import { WUPHelpers } from "web-ui-pack";
import styles from "./dataTable.module.scss";
import DropdownComplex from "../dropdown/dropdownComplex";
import ModalConfirm from "../modalConfirm/modalConfirm";

interface HeaderKey<T> {
  /** Text of header */
  text?: string | (() => string) | React.ReactElement;
  propName: keyof T;
  /** Use if value can be an array with objects */
  propKey?: keyof T[keyof T];
  type?: "email";
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  getSortValue?: (item: T) => T[keyof T];
  /** Default is true */
  canSort?: boolean;
  minWidth?: number;
  maxWidth?: number;
}

export interface DataTableConfig<T> {
  headerKeys: HeaderKey<T>[];
}

export interface DataTableProps<T> {
  items: null | T[];
  config: DataTableConfig<T>;
  getRowKey: (item: T, i: number) => string | number;
  isMultiSelect?: boolean;
  initSortKey?: keyof T;
  initIsSortAsk?: boolean;
  isShowSpinner?: boolean;
  autoScrollTop?: boolean;
  isInitSelectedAll?: boolean;
  onSelected?: (item: T | null, selected: T[]) => void;
  onSortClick?: (sortKey: keyof T, isSortAsk: boolean) => void;
  className?: string;
  footer?: JSX.Element;
  editButtons?: Array<{
    text: string;
    onClick: (v: T) => void;
    confirmMsg?: (v: T) => string;
    disabled?: (v: T) => boolean;
  }>;
  children?: React.ReactNode;
}

interface DataTableState<T> {
  selected: T[];
  sortKey: keyof T | null;
  isSortAsk: boolean;
  currentItem: T | null;
  confirmModal?: { msg: string; onConfirm: () => void | Promise<unknown> };
}

export default class DataTable<T> extends Component<DataTableProps<T>, DataTableState<T>> {
  constructor(props: DataTableProps<T>) {
    super(props);
    this.state = {
      sortKey: this.props.initSortKey || null,
      isSortAsk: this.props.initIsSortAsk || false,
      currentItem: null,
      selected: [],
      // todo remove after test
      // confirmModal: {
      //   msg: "Do you want to delete",
      //   onConfirm: () => {},
      // },
      // selected: (this.props.isInitSelectedAll && [...this.props.items]) || [],
    };
  }

  prevItems?: null | T[];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  refEl: HTMLTableElement;

  _sort = sortByKey;

  sort = memoize(this._sort);

  sorted = (): null | T[] =>
    this.props.items &&
    this.sort(this.props.items, this.state.sortKey, this.state.isSortAsk, this.props.config.headerKeys);

  componentDidMount(): void {
    this.checkComponentGotNewItems();
  }

  componentDidUpdate(): void {
    this.checkComponentGotNewItems();
  }

  get headerKeys(): HeaderKey<T>[] {
    let keys = this.props.config && this.props.config.headerKeys;

    if (this.props.isMultiSelect) {
      keys = [
        {
          propName: "_" as keyof T,
          canSort: false,
          render: (_v: T[keyof T], item: T) => (
            <span data-check={!!this.state.selected.find((v) => isEqual(v, item))} />
          ),
          text: (
            <span
              className={this.state.selected.length ? styles.checkMinus : undefined}
              data-check={this.state.selected.length === this.props.items?.length && this.state.selected.length > 0}
            />
          ),
        },
        ...keys,
      ];
    }
    if (this.props.editButtons) {
      const btns = this.props.editButtons;
      keys = [
        ...keys,
        {
          propName: "" as keyof T,
          canSort: false,
          render: (_v: T[keyof T], item: T) => (
            <DropdownComplex
              className={styles.tableDropdown}
              menuItems={btns ? btns.map((b) => ({ text: b.text, disabled: b.disabled && b.disabled(item) })) : []}
              onClick={(mi) => {
                const btn = btns.find((b) => b.text === mi.text);
                if (btn && btn.confirmMsg) {
                  this.setState({ confirmModal: { msg: btn.confirmMsg(item), onConfirm: () => btn.onClick(item) } });
                } else if (btn) {
                  btn.onClick(item);
                }
              }}
            />
          ),
          maxWidth: 50,
        },
      ];
    }

    return keys;
  }

  selectBy = (fn: (items: T[]) => T | undefined): void => {
    if (this.props.items) {
      const item = fn(this.props.items);
      item &&
        this.select(item, true, () => {
          const i = (this.sorted() as T[]).findIndex((v) => v === item);
          const el = this.refEl.querySelector(`[data-row="${i}"]`);
        });
    }
  };

  select = (item: T, isRowClick?: boolean, callback?: () => void): void => {
    const { selected } = this.state;
    // rowClick => selectRow, checkboxClick => add/remove array of Selected
    if (!isRowClick && this.props.isMultiSelect) {
      const isRemoved = remove.call(selected, (v: T) => isEqual(item, v));
      if (!isRemoved) {
        selected.push(item);
      }
    }

    this.onSelected(item, selected, callback);
  };

  clearSelected = (): void => {
    this.onSelected(null, []);
  };

  onSelected = (item: T | null, selected: T[], callback?: () => void): void => {
    this.setState({ currentItem: item, selected }, callback);
    this.props.onSelected && this.props.onSelected(item, selected);
  };

  onRowClick = (e: React.MouseEvent<HTMLTableElement>, item: T): void => {
    if (e.defaultPrevented) {
      return;
    }

    this.select(item, true);
  };

  renderValue = (headerKey: HeaderKey<T>, value: T[keyof T], item: T): React.ReactNode => {
    if (headerKey.render) {
      return headerKey.render(value, item);
    }

    return getCellValue(headerKey, value);
  };

  isRowSelected = (item: T): boolean => isEqual(this.state.currentItem, item);

  onHeaderClick = (item: HeaderKey<T>): void => {
    const { isSortAsk: isPrevSortAsk, sortKey: prevSortKey } = this.state;

    const sortKey = item.propName;
    const isSortAsk = prevSortKey === sortKey ? !isPrevSortAsk : false;

    this.setState({ sortKey, isSortAsk });
    this.props.onSortClick && this.props.onSortClick(sortKey, isSortAsk);
  };

  onTableClick = (e: React.MouseEvent<HTMLTableElement>): void => {
    if ((e.target as HTMLLinkElement)?.href || !this.props.items) {
      return;
    }

    const target = e.target as HTMLElement;
    const header = target.closest("th")?.dataset.header;
    if (header != null) {
      this.onHeaderClick(this.headerKeys[Number.parseInt(header, 10)]);
    } else {
      const closest = target.closest("tr"); // it can be null if e.target === tbody (it happens during mousePressDown-Move-mousePressUp)
      const row = closest && closest.dataset.row;
      if (row != null) {
        const item = (this.sorted() as T[])[Number.parseInt(row, 10)];
        const checkBoxClick =
          this.props.isMultiSelect && (target.closest("td") as HTMLElement).querySelector("[data-check]");
        if (!checkBoxClick) {
          this.onRowClick(e, item);
        } else {
          this.select(item);
        }
      } else if (this.props.isMultiSelect && target.closest("th")?.querySelector("[data-check]")) {
        // this is checkbox in header
        const selected = this.state.selected.length === this.props.items.length ? [] : [...this.props.items];
        this.onSelected(null, selected);
      }
    }
  };

  checkComponentGotNewItems = (): boolean => {
    if (this.prevItems !== this.props.items) {
      if (this.props.autoScrollTop) {
        const arr = this.props.items;

        const el = this.refEl;
        if (el && arr) {
          WUPHelpers.scrollIntoView(el, {
            offsetTop: 80,
          });
        }
      }
      this.onSelected(null, this.props.isInitSelectedAll ? [...(this.props.items || [])] : []);

      this.prevItems = this.props.items;
      return true;
    }
    return false;
  };

  renderHeaderCell = (hItem: HeaderKey<T>, i: number): React.ReactElement<HTMLTableHeaderCellElement> => {
    const text = getHeaderText(hItem);
    return (
      <th
        key={hItem.propName as string}
        style={{ minWidth: hItem.minWidth, maxWidth: hItem.maxWidth }}
        className={hItem.canSort === false ? undefined : styles.sort}
        data-header={hItem.canSort === false ? undefined : i}
      >
        <div
          className={
            this.state.sortKey === hItem.propName
              ? cx([styles.currentSort, this.state.isSortAsk ? styles.sortAsc : undefined])
              : undefined
          }
        >
          {text}
        </div>
      </th>
    );
  };

  renderRowCell = (hItem: HeaderKey<T>, item: T): React.ReactElement<HTMLTableDataCellElement> => {
    const defValue = item[hItem.propName];
    const value = this.renderValue(hItem, defValue, item);
    const strValue = typeof +defValue === "string" ? `${defValue}` : undefined;
    return (
      <td
        key={hItem.propName as string}
        title={hItem.maxWidth ? strValue : undefined}
        style={{ maxWidth: hItem.maxWidth }}
      >
        {value}
      </td>
    );
  };

  render(): React.ReactElement {
    let body;

    const lst = this.sorted();
    const { headerKeys } = this;

    // getRowKey is required in props now
    // const getRowKey = this.props.getRowKey ? this.props.getRowKey : (item, i) => `${item[headerKeys[0]]}_${i}`;
    const { getRowKey } = this.props;
    const header = headerKeys.map(this.renderHeaderCell);

    if (lst) {
      body = lst.map((item, i) => (
        <tr key={getRowKey(item, i)} className={this.isRowSelected(item) ? styles.selected : undefined} data-row={i}>
          {headerKeys.map((hItem) => this.renderRowCell(hItem, item))}
        </tr>
      ));
      if (!lst.length) {
        body = (
          <tr className={styles.noItems}>
            <td colSpan={headerKeys.length}>
              <h4 aria-level={2}>No results found</h4>
              <p>Nothing was found.</p>
              <p>Please try searching with another term.</p>
            </td>
          </tr>
        );
      }
    }

    return (
      <div className={cx([styles.tableContainer, this.props.className])} role="presentation">
        {this.props.children}
        <div className={styles.spinnerWrapper}>
          {this.props.isShowSpinner ? <wup-spin isOverflow className={styles.spinner} /> : null}
          {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
          <table
            onClick={this.onTableClick}
            ref={(el) => {
              this.refEl = el as HTMLTableElement;
            }}
            className={cx([
              this.props.isMultiSelect ? styles.multiSelect : undefined, //
              this.props.editButtons ? styles.editBtns : undefined,
            ])}
          >
            <thead>
              <tr>{header}</tr>
            </thead>
            <tbody>{body}</tbody>
          </table>
          {this.props.footer}
        </div>
        {!this.state.confirmModal ? null : (
          <ModalConfirm
            onClosed={() => this.setState({ confirmModal: undefined })}
            onConfirm={this.state.confirmModal?.onConfirm}
          >
            {this.state.confirmModal.msg}
          </ModalConfirm>
        )}
      </div>
    );
  }
}

function toUpperCaseFirst(v: string): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function getHeaderText<T>(header: HeaderKey<T>): string | React.ReactElement {
  return (
    (typeof header.text === "function" && header.text()) ||
    (header.text as string) ||
    toUpperCaseFirst(header.propName as string)
  );
}

function getCellValue<T>(headerKey: HeaderKey<T>, value: T[keyof T]): React.ReactNode {
  if (value == null) return value;
  if (Array.isArray(value) && headerKey.propKey) {
    return value.map((iv) => iv && iv[headerKey.propKey]);
  }
  if (headerKey.propKey) return value[headerKey.propKey];
  if (headerKey.type === "email") return <a href={`mailto:${value}`}>{value}</a>;
  // if (value instanceof Date) {
  //   return DateToString(value);
  // }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return value;
}

function sortByKey<T>(
  array: T[],
  sortKey: keyof T | undefined | null,
  isSortAsk: boolean,
  headerKeys: HeaderKey<T>[]
): T[] {
  if (!sortKey) {
    return array;
  }

  let getVal = (v: T, sortK: keyof T) => v[sortK];
  const hKey = headerKeys.find((h) => h.propName === sortKey);
  if (hKey?.getSortValue) {
    getVal = (v: T) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      hKey.getSortValue(v);
  } else if (hKey?.render) {
    const item = array && array[0];
    const str = item ? hKey.render(array[0][sortKey], array[0]) : null;
    if (typeof str === "string" || typeof str === "number") {
      getVal = (v: T) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        hKey.render(v[sortKey], v) as T[keyof T];
    }
  }

  return array.sort((a, b) => {
    const v1 = isSortAsk ? getVal(a, sortKey) : getVal(b, sortKey);
    const v2 = isSortAsk ? getVal(b, sortKey) : getVal(a, sortKey);
    if (v1 == null && v2 == null) {
      return 0;
    }
    if (v1 == null) {
      return -1;
    }
    if (v2 == null) {
      return 1;
    }

    if (v1 instanceof Date) {
      const d1 = v1.getTime();
      const d2 = (v2 as unknown as Date).getTime();
      if (d1 > d2) return 1;
      if (d1 < d2) return -1;
      return 0;
    }
    if (typeof v1 === "string") {
      // natural sorting can be different for browsers: https://stackoverflow.com/questions/51165/how-to-sort-strings-in-javascript
      return v1.localeCompare(v2 as unknown as string, undefined, {
        sensitivity: "base",
        ignorePunctuation: true,
        numeric: true,
      });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (v1 > v2) - (v1 < v2);
  });
}
function isEqual<T>(v1: T, v2: T) {
  return v1 === v2;
}
