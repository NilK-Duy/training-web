import * as React from "react";
import {
  DataGrid,
  gridPageSizeSelector,
  GridPagination,
  gridFilteredTopLevelRowCountSelector,
  useGridRootProps,
  GridValidRowModel,
  GridColumnVisibilityModel,
  GridSortModel,
  GridToolbar,
  gridClasses,
  useGridApiContext,
  useGridSelector
} from "@mui/x-data-grid";
import { Box, TablePaginationProps } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import { alpha, styled } from "@mui/material/styles";
import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";
const ODD_OPACITY = 0.2;
const pageSizeOptions = [5, 25, 50, 100];
const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }
  return 0;
};
function Pagination({
  page,
  onPageChange,
  className,
  handlePage,
  handleTotalPage,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className"> & {
  handlePage: (newPage: number) => void;
  handleTotalPage: (totalPages: number) => void;
}) {
  const apiRef = useGridApiContext();
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  const rootProps = useGridRootProps();
  const pageCount = getPageCount(rootProps.rowCount ?? visibleTopLevelRowCount, pageSize);
  handleTotalPage(pageCount);
  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event: any, newPage: number) => {
        onPageChange(event, newPage - 1);
        handlePage(newPage);
      }}
    />
  );
}

function CustomPagination(props: { handlePage: (newPage: number) => void; handleTotalPage: (totalPages: number) => void }) {
  const { handlePage, handleTotalPage, ...otherProps } = props;
  return (
    <GridPagination
      ActionsComponent={(paginationProps) => <Pagination handleTotalPage={handleTotalPage} handlePage={handlePage} {...paginationProps} />}
      {...otherProps}
    />
  );
}
export const useDebouncedEffect = (effect: () => void, deps: any[], delay: number): void => {
  React.useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
}

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.cell}`]: {
    padding: '6px',
    whiteSpace: "normal !important",
    wordWrap: "break-word !important",
  },
  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: "#1976d2",
    fontWeight: "bold",
    fontSize: "15px",
    color: "#fff",
    "& .Mui-checked": {
      color: "#fff !important",
    },
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
        "@media (hover: none)": {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },
  [`& .blocked`]: {
    backgroundColor: "#f3d2d2",
  },
  [`& .successfully`]: {
    backgroundColor: "#b5e2b5",
  },
  [`& .text-blue-400`]: {
    color: '#60a5fa'
  },
  [`& .text-fuchsia-500`]: {
    color: '#d846ef'
  },
  [`& .text-red-600`]: {
    color: '#dc2626'
  },
  [`& .text-yellow-400`]: {
    color: '#facc15'
  },
  [`& .text-green-600`]: {
    color: '#16a34a'
  },
  [`& .${gridClasses.row}.disabled`]: {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
    pointerEvents: "none",
    opacity: 0.6,
  },
}));

export default function StripedDataTable({
  currentPage,
  handleTotalPage,
  initialState,
  hiddenFooter = false,
  disableVirtualization = false,
  getHeight = true,
  autoHeight = true,
  checkboxSelection = true,
  onSelectionModelChange,
  onChangePageSizeOptions,
  handlePage,
  columns,
  rows,
  loading,
  rowCount,
  processRowUpdate,
  apiRef,
  onRowEditStop,
  isRowSelectable,
  selectionModel,
  customToolbar = null, 
  pageSize,
  errorStatus,
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  sortingMode,
  sortModel,
  onSortModelChange
}: {
  currentPage?: number;
  initialState?: object;
  hiddenFooter?: boolean;
  handleTotalPage?: (totalPages: number) => void;
  onChangePageSizeOptions?: (pageSizeOption: number) => void;
  getHeight?: boolean;
  autoHeight?: boolean;
  disableVirtualization?: boolean;
  handlePage: (newPage: number) => void;
  columns: any;
  onSelectionModelChange?: any;
  rows: any;
  checkboxSelection?: boolean;
  loading: boolean;
  rowCount?: number;
  processRowUpdate?: (newRow: GridValidRowModel, oldRow: GridValidRowModel, event?: any) => GridValidRowModel;
  onRowEditStop?: (params: any, event: any) => any;
  apiRef?: any;
  isRowSelectable?: (params: any) => any;
  selectionModel?: any;
  customToolbar?: JSX.Element | null;
  pageSize?: number;
  errorStatus?: number | null;
  columnVisibilityModel?: GridColumnVisibilityModel | undefined;
  onColumnVisibilityModelChange?: (model: GridColumnVisibilityModel) => void;
  sortingMode?: 'client' | 'server';
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;
}) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: currentPage ?? 0,
    pageSize: pageSize ?? 5,
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = event.keyCode || event.which;
    if ((keyCode >= 48 && keyCode <= 57) || keyCode === 46 || keyCode === 8) {
      /* empty */
    } else {
      event.preventDefault();
    }
  };
  const [jumPage, setJumPage] = React.useState<number>(0);
  if (onChangePageSizeOptions) {
    onChangePageSizeOptions(paginationModel.pageSize);
  }
  const handleChangeJumPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value === "") {
      setJumPage(paginationModel.page);
      return;
    }
    setJumPage(parseInt(event.target.value));
  };
  React.useEffect(() => {
    setPaginationModel((prevModel) => ({
      ...prevModel,
      page: currentPage ? currentPage - 1 : 0,
    }));
  }, [currentPage]);
  const safeHandleTotalPage =
    handleTotalPage ||
    (() => {
      //
    });
  useDebouncedEffect(
    () => {
      if(!jumPage) return;
      const pageCount = getPageCount(rowCount ?? 0, paginationModel.pageSize);
      if (jumPage > pageCount) {
        setJumPage(pageCount);
      }
      handlePage(jumPage);
      setPaginationModel((prevModel) => ({
        ...prevModel,
        page: jumPage - 1,
      }));
    },
    [jumPage],
    800
  );

  return (
    <Box sx={autoHeight ? { width: "100%" } : { width: "100%", height: "80vh" }}>
      <StripedDataGrid
        disableColumnMenu
        disableRowSelectionOnClick
        initialState={initialState}
        density={"compact"}
        getRowHeight={getHeight ? () => "auto" : undefined}
        rows={rows}
        autoHeight={autoHeight}
        rowCount={rowCount}
        loading={loading}
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        getRowClassName={(params: any) => (params.row.disabled ? "disabled" : params.indexRelativeToCurrentPage % 2 === 0 ? "odd" : "even")}
        onRowSelectionModelChange={onSelectionModelChange}
        checkboxSelection={checkboxSelection}
        columns={columns}
        hideFooter={hiddenFooter}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        slots={{
          noRowsOverlay: () => <CustomNoRowsOverlay errorStatus={errorStatus} />,
          toolbar: customToolbar ? () => customToolbar : GridToolbar,
          pagination: () => (
            <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <CustomPagination handleTotalPage={safeHandleTotalPage} handlePage={handlePage} />
            </Box>
          ),
        }}
        sx={{ "--DataGrid-overlayHeight": "300px", border: "none !important" }}
        keepNonExistentRowsSelected
        disableVirtualization={disableVirtualization}
        rowSelectionModel={selectionModel}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        sortingMode={sortingMode}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
      />

      {!hiddenFooter ? (
        <div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "200px",
              position: "relative",
              left: "1%",
              top: "-37px",
            }}
          >
            <label htmlFor="jum-page">Page:</label>
            <input
              value={jumPage === 0 ? "" : jumPage}
              min={0}
              onKeyDown={handleKeyDown}
              onChange={handleChangeJumPage}
              id="jum-page"
              style={{ maxWidth: "70px" }}
            />
          </Box>
        </div>
      ) : (
        <></>
      )}
    </Box>
  );
}
