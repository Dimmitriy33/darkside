/* eslint-disable max-classes-per-file */
import { useEffect, useRef, useState } from "react";
import promiseWait from "@/helpers/promiseWait";
import { apiDeleteProd, apiGetProducts } from "@/api/apiProduct";
import TextControl from "@/elements/TextControl";
import { IPagination } from "@/elements/pagination/pagination.types";
import BaseButton from "@/elements/buttonBase/buttonBase";
import { createSearchParams, useNavigate } from "react-router-dom";
import { urlProductAdd, urlProductUpdate } from "@/mainRouterPathes";
import DataTable, { DataTableConfig, DataTableProps } from "../../../elements/dataTable/dataTable";
import Pagination, { PaginationDefault } from "../../../elements/pagination/pagination";
import styles from "./adminProducts.module.scss";
import { IProduct, ISearchProductModel } from "../productTypes";

const dtConfig: DataTableConfig<IProduct> = {
  headerKeys: [
    { propName: "name", text: "Name", render: (_v, item) => `${item.name}` },
    {
      propName: "category",
      text: "Category",
      render: (_v, item) => `${item.category}`,
    },
    {
      propName: "price",
      text: "Price",
      render: (_v, item) => `${item.price}$`,
    },
    { propName: "salePerc", text: "Sale Percentage", render: (_v, item) => (item.salePerc ? `${item.salePerc}%` : "") },
  ],
};

let refreshMe: () => void;

export default function AdminProducts(): React.ReactElement {
  const navigate = useNavigate();
  const [model, setModel] = useState({ pageModel: PaginationDefault, model: {} as ISearchProductModel });
  const [items, setItems] = useState<IProduct[] | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const throttling = useRef(false);

  const editButtons: DataTableProps<IProduct>["editButtons"] = [
    {
      text: "Edit",
      onClick: (v: IProduct) => {
        navigate({
          pathname: urlProductUpdate,
          search: createSearchParams({
            id: v.id,
          }).toString(),
        });
      },
    },
    {
      text: "Delete",
      onClick: (v: IProduct) => apiDeleteProd(v.id).then(() => refreshMe()),
      confirmMsg: (v: IProduct) => `Do you want to delete ${v.name}`,
    },
  ];

  function onModelChanged(m: { model: ISearchProductModel; pageModel: IPagination }) {
    if (throttling.current) {
      return;
    }

    throttling.current = true;
    setTimeout(() => {
      throttling.current = false;
      setModel(m);
      setShowSpinner(true);

      const p = apiGetProducts(m.model, m.pageModel.size, (m.pageModel.currentNumber - 1) * m.pageModel.size).then(
        (v) => {
          setItems(v?.items || []);
          setModel({
            ...m,
            pageModel: { ...m.pageModel, totalCount: v?.totalCount || 0 },
          });
        }
      );
      return promiseWait(p).finally(() => setShowSpinner(false));
    }, 300);
  }

  refreshMe = () => {
    onModelChanged(model);
  };

  useEffect(refreshMe, []);

  const renderPreHeader = () => (
    <div>
      <TextControl
        intlLabel="Search"
        init={(el) => {
          el.addEventListener("$change", (ev) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const v = ev.currentTarget?.$value;
            onModelChanged({ ...model, model: { ...model.model, term: v } });
          });
          el.$options.validations = {
            required: false,
          };
        }}
      />
    </div>
  );

  const renderFooter = items?.length ? (
    <Pagination //
      onChanged={(pageModel) =>
        onModelChanged({
          ...model,
          pageModel,
        })
      }
      pagination={model.pageModel}
    />
  ) : undefined;

  return (
    <div className={styles.adminProducts}>
      <h3>Admin Products</h3>
      <div className={styles.adminProducts__actions}>
        <BaseButton text="Create" onClick={() => navigate(urlProductAdd)} />
      </div>
      <DataTable
        className={styles.usersView}
        items={items}
        config={dtConfig}
        getRowKey={(item) => item.id}
        isShowSpinner={showSpinner}
        isMultiSelect
        onSortClick={() => onModelChanged({ ...model })}
        footer={renderFooter}
        editButtons={editButtons}
      >
        {renderPreHeader()}
      </DataTable>
    </div>
  );
}
