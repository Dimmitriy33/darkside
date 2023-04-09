import { Link, useNavigate } from "react-router-dom";
import useTypedSelector from "@/redux/typedSelector";
import { urlHome, urlLogin } from "@/mainRouterPathes";
import logo from "images/logo-no-background.png";
import { useCallback, useState } from "react";
import { apiLogout } from "@/api/apiAccount";
import { useIntl } from "react-intl";
import Dropdown from "@/elements/dropdown/dropdown";
import BaseButton from "@/elements/buttonBase/buttonBase";
import Store, { Types } from "@/redux";
import styles from "./header.module.scss";
import AvatarImage from "../avatarImage/avatarImage";

export default function Header(): JSX.Element {
  const [langCheck, setLangCheck] = useState(false);
  const user = useTypedSelector((state) => state.currentUser);
  const intl = useIntl();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await apiLogout();
  }, []);

  const editButtons = [
    {
      text: intl.formatMessage({ id: "Logout" }),
      onClick: () => logout(),
    },
  ];

  return (
    <div className={styles.header}>
      <Link to={urlHome}>
        <img className={styles.logo} src={logo} alt="Logo" />
      </Link>
      <button
        className={styles.btnLang}
        type="button"
        onClick={() => {
          setLangCheck(!langCheck);
          Store.dispatch({
            type: Types.SWITCHLANG,
            data: {
              lang: langCheck ? "en" : "ru",
            },
          });
        }}
      >
        {langCheck ? "en" : "ru"}
      </button>
      {user ? (
        <>
          <span className={styles.username}>{`${user.firstName} ${user.lastName}`}</span>
          <AvatarImage user={user} />
          <Dropdown
            values={editButtons.map((v) => v.text)}
            className={styles.avatarImageMenu}
            onChanged={(text) => {
              editButtons.find((b) => b.text === text)?.onClick();
            }}
          />
        </>
      ) : (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <BaseButton className={styles.btnLogin} type="button" onClick={() => navigate(urlLogin)} intlText="Login" />
      )}
    </div>
  );
}
