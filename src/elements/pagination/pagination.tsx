import BaseButton from "../buttonBase/buttonBase";
import Dropdown from "../dropdown/dropdown";
import styles from "./pagination.module.scss";
import { IPagination } from "./pagination.types";

interface PaginationProps {
  onChanged: (model: IPagination) => void;
  pagination: IPagination | undefined;
}

export default function Pagination(props: PaginationProps): JSX.Element | null {
  const pag = props.pagination; // || { pageNumber: 1, pageSize: 10, total: 0 };
  if (!pag) {
    return null;
  }

  const indexOfLastItem = pag.currentNumber * pag.size;
  const indexOfFirstItem = indexOfLastItem - pag.size;
  const totalPages = Math.ceil(pag.totalCount / pag.size);

  return (
    <div className={styles.pagination}>
      <Dropdown
        currentValue={pag.size}
        onChanged={(pageSize) => props.onChanged({ ...pag, size: pageSize, currentNumber: 1 })}
        values={[5, 10, 20]}
        prefix={<span>Rows per page:</span>}
      />
      <span>
        {`${indexOfFirstItem + 1}-${indexOfLastItem > pag.totalCount ? pag.totalCount : indexOfLastItem} of ${
          pag.totalCount
        }`}
      </span>
      <BaseButton
        text=""
        onClick={() => props.onChanged({ ...pag, currentNumber: pag.currentNumber - 1 })}
        disabled={pag.currentNumber === 1}
        className={styles.prevPage}
      />
      <BaseButton
        text=""
        onClick={() => props.onChanged({ ...pag, currentNumber: pag.currentNumber + 1 })}
        disabled={pag.currentNumber >= totalPages}
        className={styles.nextPage}
      />
    </div>
  );
}

export const PaginationDefault: IPagination = {
  currentNumber: 1,
  size: 10,
  totalCount: 0,
};
