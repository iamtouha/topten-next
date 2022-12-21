import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type SetStateAction,
  type Dispatch,
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
  PaginationState,
  VisibilityState,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import styles from "@/styles/table.module.css";

interface Props<TData extends unknown, TValue = any> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isRefetching?: boolean;
  isError?: boolean;
  state?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    pagination?: PaginationState;
    columnVisibility?: VisibilityState;
    globalFilter?: string;
  };
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
  setColumnVisibility?: Dispatch<SetStateAction<VisibilityState>>;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  itemsPerPageOptions?: number[];
  itemsCount?: number;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  headerRowProps?: HTMLAttributes<HTMLTableRowElement>;
  headerCellProps?: HTMLAttributes<HTMLTableCellElement>;
  bodyRowProps?: HTMLAttributes<HTMLTableRowElement>;
  bodyCellProps?: HTMLAttributes<HTMLTableCellElement>;
  footerRowProps?: HTMLAttributes<HTMLTableRowElement>;
  footerCellProps?: HTMLAttributes<HTMLTableCellElement>;
  filterInputClassName?: string;
  sortedColumnHeaderClassName?: string;
  ascendingSortIndecator?: ReactNode;
  descendingSortIndecator?: ReactNode;
  hideBottomBar?: boolean;
  bottomBarClassName?: string;
  nextPageBtnClassName?: string;
  previousPageBtnClassName?: string;
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

const CustomTable = <TData extends unknown, TValue = any>(
  props: Props<TData, TValue>
) => {
  const { manualFiltering, manualSorting, manualPagination } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const table = useReactTable<TData>({
    columns: props.columns,
    data: props.data,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      columnVisibility,
      ...props.state,
    },
    filterFns: { fuzzy: fuzzyFilter },
    manualSorting,
    pageCount:
      manualPagination && props.itemsCount
        ? Math.ceil(
            props.itemsCount /
              (props.state?.pagination?.pageSize ?? pagination.pageSize)
          )
        : undefined,
    manualFiltering,
    manualPagination,
    onSortingChange: props.setSorting ?? setSorting,
    onColumnFiltersChange: props.setColumnFilters ?? setColumnFilters,
    onGlobalFilterChange: props.setGlobalFilter ?? setGlobalFilter,
    onPaginationChange: props.setPagination ?? setPagination,
    onColumnVisibilityChange: props.setColumnVisibility ?? setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: fuzzyFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <>
      <table className={props.tableClassName ?? "w-full"}>
        <thead className={props.headerClassName}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr {...(props.headerRowProps ?? {})} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  {...(props.headerCellProps ?? {
                    className:
                      "border-2 border-lowkey px-4 pt-2 pb-3.5 text-left text-xs font-bold tracking-wide text-black md:text-sm",
                  })}
                  key={header.id}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? props.sortedColumnHeaderClassName ??
                              "flex flex-wrap gap-1 cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: props.ascendingSortIndecator ?? " 🔼",
                          desc: props.descendingSortIndecator ?? " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter
                            column={header.column}
                            table={table}
                            inputClassName={
                              props.filterInputClassName ??
                              "mt-1.5 w-36 border text-xs shadow md:text-sm"
                            }
                          />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={props.bodyClassName}>
          {props.isLoading || props.isRefetching ? (
            <tr>
              <td
                className="border-2 border-lowkey px-4"
                {...(props.bodyCellProps ?? {})}
                colSpan={table.getVisibleLeafColumns().length}
              >
                <div className="py-6 text-center text-lg">Loading...</div>
              </td>
            </tr>
          ) : null}
          {!(props.isLoading && props.isRefetching) && props.isError ? (
            <tr>
              <td
                className="border-2 border-lowkey px-4"
                {...(props.bodyCellProps ?? {})}
                colSpan={table.getVisibleLeafColumns().length}
              >
                <div className="py-6 text-center text-lg">
                  An error occured!
                </div>
              </td>
            </tr>
          ) : null}
          {!(props.isLoading || props.isRefetching || props.isError)
            ? table.getRowModel().rows.map((row) => {
                return (
                  <tr {...(props.bodyRowProps ?? {})} key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          className="border-2 border-lowkey px-2 py-1"
                          {...(props.bodyCellProps ?? {})}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            : null}
        </tbody>
        <tfoot className={props.footerClassName}>
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
      <div
        className={
          props.bottomBarClassName ??
          "mt-5 flex w-full flex-wrap items-center gap-2 text-sm md:text-base"
        }
      >
        <button
          aria-label="paginate back by 1 page"
          className={
            props.previousPageBtnClassName ??
            "group grid aspect-square w-8 place-items-center border border-neutral-500"
          }
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          aria-label="paginate forward by 1 page"
          className={
            props.nextPageBtnClassName ??
            "group grid aspect-square w-8 place-items-center border border-neutral-500"
          }
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
          {(props.itemsPerPageOptions ?? [10, 20, 30, 40]).map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CustomTable;

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
