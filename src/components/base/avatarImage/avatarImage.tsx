import { IUser } from "@/components/account/accountTypes";
import styles from "./avatarImage.module.scss";

interface AvatarImageProps {
  user: IUser;
}

export default function AvatarImage(props: AvatarImageProps): JSX.Element {
  return (
    <div className={styles.profilePic}>
      {[props.user.firstName[0], props.user.lastName[0]].filter((v) => v).join("")}
    </div>
  );
}
