/* eslint-disable max-classes-per-file */
import { useEffect, useRef, useState } from "react";
import promiseWait from "@/helpers/promiseWait";
import TextControl from "@/elements/TextControl";
import { IPagination } from "@/elements/pagination/pagination.types";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { apiGetUsers } from "@/api/apiAccount";
import DataTable, { DataTableConfig } from "../../../elements/dataTable/dataTable";
import Pagination, { PaginationDefault } from "../../../elements/pagination/pagination";
import styles from "./adminUsers.module.scss";
import { ISearchUserModel, IUser } from "../accountTypes";

let refreshMe: () => void;

export default function AdminUsers(): React.ReactElement {
  const navigate = useNavigate();
  const intl = useIntl();
  const [model, setModel] = useState({ pageModel: PaginationDefault, model: {} as ISearchUserModel });
  const [items, setItems] = useState<IUser[] | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const throttling = useRef(false);

  const dtConfig: DataTableConfig<IUser> = {
    headerKeys: [
      {
        propName: "firstName",
        text: intl.formatMessage({ id: "FirstName" }),
        render: (_v, item) => `${item.firstName}`,
      },
      { propName: "lastName", text: intl.formatMessage({ id: "LastName" }), render: (_v, item) => `${item.lastName}` },
      {
        propName: "username",
        text: intl.formatMessage({ id: "Username" }),
        render: (_v, item) => `${item.username}`,
      },
      {
        propName: "email",
        text: intl.formatMessage({ id: "Email" }),
        render: (_v, item) => `${item.email}`,
      },
      {
        propName: "balance",
        text: intl.formatMessage({ id: "Balance" }),
        render: (_v, item) => `${item.balance}$`,
      },
    ],
  };

  // const editButtons: DataTableProps<IUser>["editButtons"] = [
  //   {
  //     text: "Edit",
  //     onClick: (v: IUser) => {
  //       navigate({
  //         pathname: urlProductUpdate,
  //         search: createSearchParams({
  //           id: v.id,
  //         }).toString(),
  //       });
  //     },
  //   },
  //   {
  //     text: "Delete",
  //     onClick: (v: IUser) => apiDeleteProd(v.id).then(() => refreshMe()),
  //     confirmMsg: (v: IUser) => `Do you want to delete ${v.name}`,
  //   },
  // ];

  function onModelChanged(m: { model: ISearchUserModel; pageModel: IPagination }) {
    if (throttling.current) {
      return;
    }

    throttling.current = true;
    setTimeout(() => {
      throttling.current = false;
      setModel(m);
      setShowSpinner(true);

      const p = apiGetUsers(m.model, m.pageModel.size, (m.pageModel.currentNumber - 1) * m.pageModel.size).then((v) => {
        setItems(v?.items || []);
        setModel({
          ...m,
          pageModel: { ...m.pageModel, totalCount: v?.totalCount || 0 },
        });
      });
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
      <h3>Admin Users</h3>
      <DataTable
        className={styles.usersView}
        items={items}
        config={dtConfig}
        getRowKey={(item) => item.username}
        isShowSpinner={showSpinner}
        isMultiSelect
        onSortClick={() => onModelChanged({ ...model })}
        footer={renderFooter}
        // editButtons={editButtons}
      >
        {renderPreHeader()}
      </DataTable>
    </div>
  );
}
