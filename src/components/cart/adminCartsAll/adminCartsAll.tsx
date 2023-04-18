/* eslint-disable max-classes-per-file */
import { useEffect, useRef, useState } from "react";
import promiseWait from "@/helpers/promiseWait";
import TextControl from "@/elements/TextControl";
import { IPagination } from "@/elements/pagination/pagination.types";
import { useNavigate } from "react-router-dom";
import AvatarImage from "@/components/base/avatarImage/avatarImage";
import { WUPHelpers } from "web-ui-pack";
import { IUser } from "@/components/account/accountTypes";
import { ISearchProductModel } from "@/components/product/productTypes";
import { apiGetPurchases } from "@/api/apiPurchases";
import { useIntl } from "react-intl";
import Header from "@/components/base/header/header";
import { ICartElem, ISearchCartModel } from "../cartTypes";
import DataTable, { DataTableConfig } from "../../../elements/dataTable/dataTable";
import Pagination, { PaginationDefault } from "../../../elements/pagination/pagination";
import styles from "./adminCartsAll.module.scss";

let refreshMe: () => void;

export default function CartsAll(): React.ReactElement {
  const navigate = useNavigate();
  const intl = useIntl();
  const [model, setModel] = useState({ pageModel: PaginationDefault, model: {} as ISearchProductModel });
  const [items, setItems] = useState<ICartElem[] | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const throttling = useRef(false);

  const dtConfig: DataTableConfig<ICartElem> = {
    headerKeys: [
      { propName: "id", text: intl.formatMessage({ id: "Id" }), render: (_v, item) => `${item.id}` },
      {
        propName: "user",
        text: intl.formatMessage({ id: "User" }),
        render: (_v, item) => <AvatarImage user={item.user} />,
      },
      {
        propName: "date",
        text: intl.formatMessage({ id: "Date" }),
        render: (_v, item) => WUPHelpers.dateToString(new Date(item.date), "yyyy-MM-dd hh:mm:ss.fff Z"),
      },
      {
        propName: "totalPrice",
        text: intl.formatMessage({ id: "TotalPrice" }),
        render: (_v, item) => `${item.totalPrice.toFixed(2)}$`,
      },
      {
        propName: "items",
        text: intl.formatMessage({ id: "Items" }),
        render: (_v, item) => (
          <div className={styles.cart__elems}>
            {item.items.map((el) => (
              <AvatarImage
                user={
                  {
                    firstName: el.product.name,
                    lastName: "",
                  } as IUser
                }
                image={el.product.imageUrl}
              />
            ))}
          </div>
        ),
      },
    ],
  };

  function onModelChanged(m: { model: ISearchCartModel; pageModel: IPagination }) {
    if (throttling.current) {
      return;
    }

    throttling.current = true;
    setTimeout(() => {
      throttling.current = false;
      setModel(m);
      setShowSpinner(true);

      const p = apiGetPurchases(m.model, m.pageModel.size, (m.pageModel.currentNumber - 1) * m.pageModel.size).then(
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
    <>
      <Header />
      <div className={styles.adminCarts}>
        <h3>Admin Carts</h3>
        <DataTable
          items={items}
          config={dtConfig}
          getRowKey={(item) => item.id}
          isShowSpinner={showSpinner}
          onSortClick={() => onModelChanged({ ...model })}
          footer={renderFooter}
        >
          {renderPreHeader()}
        </DataTable>
      </div>
    </>
  );
}
