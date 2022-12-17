import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import {
  type Column,
  type Table,
  type ColumnFiltersState,
  type FilterFn,
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import styles from "@/styles/table.module.css";

interface Props<TData extends unknown, TValue = any> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  headerRowProps: HTMLAttributes<HTMLTableRowElement>;
  headerCellProps: HTMLAttributes<HTMLTableCellElement>;
  bodyRowProps: HTMLAttributes<HTMLTableRowElement>;
  bodyCellProps: HTMLAttributes<HTMLTableCellElement>;
  footerRowProps: HTMLAttributes<HTMLTableRowElement>;
  footerCellProps: HTMLAttributes<HTMLTableCellElement>;
  filterInputClassName: string;
  sortedColumnHeaderClassName: string;
  ascendingSortIndecator: ReactNode;
  descendingSortIndecator: ReactNode;
  hideBottomBar: boolean;
  bottomBarClassName: string;
  nextPageBtnClassName: string;
  previousPageBtnClassName: string;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const CustomTableComponent = <TData extends unknown, TValue = any>(
  props: Props<TData, TValue>
) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable<TData>({
    columns: props.columns,
    data: props.data,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="" {...props.headerRowProps} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  {...props.headerCellProps}
                  key={header.id}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? props.sortedColumnHeaderClassName
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: props.ascendingSortIndecator,
                        desc: props.descendingSortIndecator,
                      }[header.column.getIsSorted() as string] ?? null}
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter
                            column={header.column}
                            table={table}
                            inputClassName={props.filterInputClassName}
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr {...props.bodyRowProps} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td {...props.bodyCellProps} key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr {...props.footerRowProps} key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th {...props.footerCellProps} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className={props.bottomBarClassName}>
        <button
          aria-label="paginate back by 1 page"
          className={props.previousPageBtnClassName}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          aria-label="paginate forward by 1 page"
          className={props.nextPageBtnClassName}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="hidden items-center gap-1 md:flex">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 border p-1"
          />
        </span>
        <select
          className="py-1"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomTableComponent;

const Filter = <TData extends unknown, TValue = any>({
  column,
  table,
  inputClassName,
}: {
  column: Column<TData, TValue>;
  table: Table<TData>;
  inputClassName: string;
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column, firstValue]
  );

  return typeof firstValue === "number" ? (
    <DebouncedInput
      type="number"
      min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
      max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
      value={(columnFilterValue as [number, number])?.[0] ?? ""}
      onChange={(value) =>
        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
      }
      placeholder={`Range ${
        column.getFacetedMinMaxValues()?.[0]
          ? `(${column.getFacetedMinMaxValues()?.[0]}`
          : ""
      } ~ ${
        column.getFacetedMinMaxValues()?.[1]
          ? `${column.getFacetedMinMaxValues()?.[1]}`
          : ""
      })`}
      className={inputClassName}
    />
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className={inputClassName}
        list={column.id + "list"}
      />
    </>
  );
};

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
