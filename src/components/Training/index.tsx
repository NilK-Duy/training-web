import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/system';
import { GridColDef, GridColumnVisibilityModel, GridRenderCellParams, GridSortModel } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getTrainings } from "../../helpers/fetch";
import { formatCurrency } from "../../helpers/formatNumber";
import StripedDataTable from "../StripedDataTable";
import CustomToolbar from "./CustomToolbar";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const initialState = {
    value: 0,
    keyword: '',
    language: 'en',
    cities: [],
    selectedCity: [],
    selectedCities: '',
    companySize: [],
    rows: [],
    companyRows: [],
    totalDocs: 0,
    total: 0,
    loadingPage: false,
    loadingKeyWord: false,
    currentTime: "",
    lastTime: "00:00",
    nextTime: "",
    selectedStatusPartner: [],
    regions: [],
    keywords: [],
    jobSearch: "",
    startNetto: undefined,
    endNetto: undefined,
    startDate: "",
    endDate: "",
    pageCompanyTable: 1,
    limitCompanyTable: 5,
    rowsCompanyTable: [],
    totalDocsCompanyTable: 0,
    loadingCompanyTable: false,
    errorStatusCompany: null,
    companyName: "",
};
// reducer
const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "SET_COMPANY_NAME":
            return { ...state, companyName: action.payload };
        case 'SET_KEYWORD':
            return { ...state, keyword: action.payload };
        case 'SET_ROWS':
            return { ...state, rows: action.payload };
        case 'SET_TOTAL':
            return { ...state, total: action.payload };
        case 'SET_LOADING_KEYWORD':
            return { ...state, loadingKeyWord: action.payload };
        case 'CLEAR_JOB_FILTER':
            return { ...state, selectedCity: [], companySize: [], jobFilterStartDate: '', jobFilterEndDate: '', selectedJobStatus: "", selectedStatusPartner: [], businessArea: [], jobSearch: "" };
        case 'SET_JOB_TAB':
            return { ...state, jobTab: action.payload };
        case 'SET_JOB_SEARCH':
            return { ...state, jobSearch: action.payload };
        case 'SET_PAGE_COMPANY':
            return { ...state, pageCompanyTable: action.payload };
        case 'SET_ROWS_COMPANY':
            return { ...state, rowsCompanyTable: action.payload };
        case 'SET_TOTAL_DOCS_COMPANY':
            return { ...state, totalDocsCompanyTable: action.payload };
        case 'SET_LOADING_COMPANY_TABLE':
            return { ...state, loadingCompanyTable: action.payload };
        case 'SET_JOB_FILTER_START_DATE':
            return { ...state, jobFilterStartDate: action.payload }
        case 'SET_JOB_FILTER_END_DATE':
            return { ...state, jobFilterEndDate: action.payload }
        case 'SET_ERROR_STATUS_COMPANY':
            return { ...state, errorStatusCompany: action.payload }
        default:
            return state;
    }
};

const StyledComponent = styled('div')({
    '&': {
        fontFamily: "Roboto, Helvetica, Arial"
    },
    '& .relatedKeywords:hover': {
        color: "#0080ff",
        cursor: "pointer"
    },
    '& table td': {
        padding: 0,
        verticalAlign: "top"
    },
    '& .averageGuaranteedCell': {
        color: "blue",
        textDecorationLine: "underline"
    },
    '& .averageGuaranteedCell:hover': {
        cursor: "pointer"
    },
    '& .centered-header .MuiDataGrid-columnHeaderTitleContainer': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    '& font-date': {
        fontSize: '12px',
    },
    '& .dateSource': {
        marginLeft: '20px'
    },
    '&. custom-date-picker': {
        width: '100px',
        fontSize: '0.875rem'
    },

})


const Training = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [debounceKeyword, setDebounceKeyword] = useState(state.keyword);
    const location = useLocation();

    const keywordInputRef = useRef<HTMLInputElement>(null);
    const keywordSearchBtnRef = useRef<HTMLButtonElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [limitCompanyTable, setLimitCompanyTable] = useState<number>(5)
    const [inputValue, setInputValue] = useState("")
    const [sortCompanyTable, setSortCompanyTable] = useState<GridSortModel>();

    
    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        (async () => {
            const searchParams = new URLSearchParams(location.search);

            const keyword = searchParams.get("q");
            const jobFilterStartDate = searchParams.get("jobFilterStartDate");
            const jobFilterEndDate = searchParams.get("jobFilterEndDate");
            const jobSearch = searchParams.get("jobSearch");

            if (keyword) dispatch({ type: "SET_KEYWORD", payload: keyword });

            if (jobFilterStartDate) dispatch({ type: "SET_JOB_FILTER_START_DATE", payload: jobFilterStartDate });
            if (jobFilterEndDate) dispatch({ type: "SET_JOB_FILTER_END_DATE", payload: jobFilterEndDate });

            if (jobSearch) dispatch({ type: "SET_JOB_SEARCH", payload: jobSearch });

            await timeout(2000);
            keywordSearchBtnRef.current?.click();
        })()
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceKeyword(state.keyword);
        }, 300);
    
        return () => clearTimeout(handler);
    }, [state.keyword]);

    const onChangeKeyword = async (event: any) => {
        dispatch({ type: 'SET_KEYWORD', payload: event.target.value });
        if (event.target.value.includes(",")) {
            keywordInputRef.current?.blur()
            keywordInputRef.current?.focus()
        }
    };

    useEffect(() => {
        const fetch = async () => {
            if (debounceKeyword !== "" && debounceKeyword?.length > 0) {
                try {
                    dispatch({
                        type: 'SET_LOADING_COMPANY_TABLE',
                        payload: true
                    })
                    dispatch({
                        type: 'SET_ERROR_STATUS_COMPANY',
                        payload: null,
                    })
                    const keywords = debounceKeyword
                        ?.split(",")
                        .map((kw: string) => kw.trim())
                        .filter((kw: string) => kw)
                        .filter((kw: string, index: number, self: string[]) => self.indexOf(kw) === index);

                    const resCompany = await getTrainings([...keywords]);
                    dispatch({
                        type: 'SET_ROWS_COMPANY',
                        payload: resCompany.docs.map((d: any, index: number) => ({ id: index, ...d }))
                    })
                    dispatch({
                        type: 'SET_TOTAL_DOCS_COMPANY',
                        payload: resCompany.totalDocs
                    })
                } catch (error) {
                    const status = axios.isAxiosError(error) ? error.response?.status ?? null : null;
                    dispatch({
                        type: 'SET_ERROR_STATUS_COMPANY',
                        payload: status,
                    })
                } finally {
                    dispatch({
                        type: 'SET_LOADING_COMPANY_TABLE',
                        payload: false
                    })
                }
            }
        }
        fetch()
    }, [state.pageCompanyTable, limitCompanyTable, sortCompanyTable])



    type CompanyRow = {
        keyword: string;
        companySrc: string;
        name: string;
        count: number;
        maxAge: number;
        minAge: number;
        avgAge: number;
        jobNewTodayCount: number;
        jobRemoveTodayCount: number;
        staffCountGlobal: string | number | null;
        revenueInEuro: string | null;
        region: string | null,
        miningDate?: string | Date;
        createdAt?: string | Date;
        updatedAt?: string | Date;
        headquarter?: string;
        [key: string]: any;
    };

    const filterJobByKeyword = async () => {

        updateUrlQueries();
        
        // dispatch({
        //     type: 'SET_PAGE_COMPANY',
        //     payload: 1
        // })
        // dispatch({
        //     type: 'SET_PAGE_JOB',
        //     payload: 1
        // })

        if (debounceKeyword !== "" && debounceKeyword?.length > 0) {
            try {
                const keywords = debounceKeyword
                    ?.split(",")
                    .map((kw: string) => kw.trim())
                    .filter((kw: string) => kw)
                    .filter((kw: string, index: number, self: string[]) => self.indexOf(kw) === index);

                dispatch({
                    type: 'SET_LOADING_COMPANY_TABLE',
                    payload: true
                })
                dispatch({
                    type: 'SET_LOADING_JOB_DETAIL_TABLE',
                    payload: true
                })


                try {

                    const resCompany = await getTrainings([...keywords])
                    dispatch({
                        type: 'SET_ROWS_COMPANY',
                        payload: resCompany.docs.map((d: any, index: number) => ({ id: index, ...d }))
                    })
                    dispatch({
                        type: 'SET_TOTAL_DOCS_COMPANY',
                        payload: resCompany.totalDocs
                    })
                } catch (error) {
                    const status = axios.isAxiosError(error) ? error.response?.status ?? null : null;
                    dispatch({
                        type: 'SET_ERROR_STATUS_COMPANY',
                        payload: status,
                    })
                } finally {
                    dispatch({
                        type: 'SET_LOADING_COMPANY_TABLE',
                        payload: false
                    })
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                dispatch({
                    type: 'SET_LOADING_JOB_DETAIL_TABLE',
                    payload: false
                })
            }

        }
    }

    const handleJobFilter = () => {
        filterJobByKeyword()
    }

    const setParam = (key: string, value: any) => {
        if (value) {
            searchParams.set(key, value)
        }
    }

    const updateUrlQueries = () => {
        setParam("q", state.keyword);
        setParam("jobSearch", state.jobSearch);

        setParam("startDate", state.startDate);
        setParam("endDate", state.endDate);
        setSearchParams(searchParams)
    }

    const onSearch = async () => {
        try {
            // if (!searchParams.get("q")) {
            //     searchParams.set("q", state.keyword);
            //     setSearchParams(searchParams)
            // }
            // const currentQueryString = `?${searchParams.toString()}`;
            // sessionStorage.setItem("analyticsFilter", currentQueryString);

            dispatch({ type: 'SET_LOADING_KEYWORD', payload: true });
            dispatch({ type: 'SET_ERROR_STATUS_COMPANY', payload: null });

            await filterJobByKeyword();

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            dispatch({ type: 'SET_LOADING_KEYWORD', payload: false });
            dispatch({ type: 'SET_LOADING_KEYWORD', payload: false });
        }
    }

    const definedCompanyColumns: GridColDef[] = [
        {
            field: "keyword",
            headerName: "Keyword",
            renderHeader: () => <Tooltip title="Keyword"><p >Keyword</p></Tooltip>,
            flex: 2,
            sortable: true,
            align: "right",
            headerAlign: "right",
        },
        {
            field: "name",
            headerName: "Company",
            renderHeader: () => <Tooltip title="Company"><p>Company</p></Tooltip>,
            filterable: false,
            flex: 3.5,
            sortable: true,
            align: "right",
            headerAlign: "right",
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <div style={{ textAlign: "right" }}>
                        <div>
                            <a target="_blank" rel="noreferrer" >
                                {params.row.name}
                            </a>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "title",
            headerName: "Title",
            renderHeader: () => <Tooltip title="Title"><p>Title</p></Tooltip>,
            flex: 4,
            sortable: true,
            align: "right",
            headerAlign: "right",
            renderCell: (params: GridRenderCellParams) => params.value
                ? `${params.value}`
                : "",
        },
        {
            field: "description",
            headerName: "Description",
            renderHeader: () => <Tooltip title="Description"><p>Description</p></Tooltip>,
            flex: 4,
            sortable: true,
            align: "right",
            headerAlign: "right",
            renderCell: (params: GridRenderCellParams) => params.value
                ? `${params.value}`
                : "",
        },
        {
            field: "price",
            headerName: "Price",
            renderHeader: () => <Tooltip title="Price"><p>Price (€)</p></Tooltip>,
            flex: 2.5,
            sortable: true,
            align: "right",
            headerAlign: "right",
            renderCell: (params: GridRenderCellParams) => {
                if (!params.value) return null;
                return (params.value && <Typography style={{ textAlign: "right" }}>{formatCurrency(params.value)?.trim()}</Typography>)
            }
        },
        {
            field: "targetGroup",
            headerName: "Target Group",
            renderHeader: () => <Tooltip title="Target Group"><p>Target Group</p></Tooltip>,
            flex: 4,
            sortable: true,
            align: "right",
            headerAlign: "right",
            renderCell: (params: GridRenderCellParams) => params.value
                ? `${params.value}`
                : "",
        },
        {
            field: "requirements",
            headerName: "Requirements",
            renderHeader: () => <Tooltip title="Requirements"><p>Requirements</p></Tooltip>,
            flex: 4,
            sortable: true,
            align: "right",
            headerAlign: "right",
            renderCell: (params: GridRenderCellParams) => params.value
                ? `${params.value}`
                : "",
        },
    ]

    const flattenObject = (obj: any, parentField = ""): Record<string, any> => {
        return Object.keys(obj).reduce((acc, key) => {
            const value = obj[key];
            const newKey = parentField ? `${parentField}.${key}` : key;

            if (Array.isArray(value)) {
                return acc;
            } else if (typeof value === "object" && value !== null) {
                return { ...acc, ...flattenObject(value, newKey) };
            }
            return { ...acc, [newKey]: value };
        }, {});
    };

    const unwantedCompanyKeys = ["_id", "id", "createdAt", "updatedAt"];

    const companyColumns = () => {
        const allFields = new Set<string>();

        if (state.rowsCompanyTable && state.rowsCompanyTable.length > 0) {
            state.rowsCompanyTable.forEach((item: any) => {
                const flatItem = flattenObject(item);
                Object.keys(flatItem).forEach(key => {
                    if (!unwantedCompanyKeys.includes(key)) {
                        allFields.add(key);
                    }
                });
            });
        }

        const existingFields = new Set(definedCompanyColumns.map(col => col.field));
        const newFields = [...allFields].filter(field => !existingFields.has(field));
        const formatHeaderName = (field: string) => {
            const lastPart = field.split(".").pop() ?? field;
            return lastPart.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
        };

        const getNestedValue = (row: any, field: string) => {
            return field.split(".").reduce((acc, key) => acc?.[key], row) ?? "";
        };

        const dynamicCompanyColumns: GridColDef[] = newFields.map(field => ({
            field: field,
            headerName: formatHeaderName(field),
            renderHeader: () => <Tooltip title={field}><p>{formatHeaderName(field)}</p></Tooltip>,
            flex: 2,
            sortable: false,
            align: "right",
            headerAlign: "right",
            renderCell: (params: GridRenderCellParams) => {
                const value = getNestedValue(params.row, field);
                return value || "";
            }
        }));
        return [...definedCompanyColumns, ...dynamicCompanyColumns];
    };

    const visibleFieldsCompany = new Set([
        "keyword",
        "name",
        "title",
        "description",
        "price",
        "targetGroup",
        "requirements"
    ]);

    const [companyColumnVisibility, setCompanyColumnVisibility] = useState<GridColumnVisibilityModel>(() => {

        return Object.fromEntries(
            definedCompanyColumns.map(col => [col.field, visibleFieldsCompany.has(col.field)])

        );
    });

    useEffect(() => {
        if (state.rowsCompanyTable.length === 0) return;
        setCompanyColumnVisibility(prev => {
            const newColumns = companyColumns().reduce((acc, col) => {
                acc[col.field] = prev[col.field] ?? visibleFieldsCompany.has(col.field);
                return acc;
            }, {} as GridColumnVisibilityModel);
            return newColumns;
        });
    }, [state.rowsCompanyTable]);

    return (
        <StyledComponent>

            <Box >
                <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: '1rem', marginTop: '1rem' }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "80%" }} className="keywordSearch">
                        <Autocomplete
                            options={state.keywords && state.keywords?.length > 0 ? state.keywords : []}
                            freeSolo
                            sx={{ width: '100%' }}
                            value={state?.keyword}
                            onChange={(event, newValue) => {
                                if (!newValue) {
                                    const keywords = state?.keyword.split(',');
                                    keywords.pop();
                                    dispatch({ type: 'SET_KEYWORD', payload: keywords.join(',') });
                                } else {
                                    const oldValues = state?.keyword.split(',');
                                    if (oldValues?.length > 1 && oldValues[0]?.length > 0) {
                                        const oldValue = oldValues.splice(0, oldValues?.length - 1)
                                        dispatch({ type: 'SET_KEYWORD', payload: `${oldValue.join(",")},${newValue}` });
                                    } else dispatch({ type: 'SET_KEYWORD', payload: newValue });
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Keyword"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Enter your keyword"
                                    onChange={onChangeKeyword}
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            keywordInputRef.current?.blur()
                                            setTimeout(() => {
                                                keywordSearchBtnRef.current?.click();
                                            }, 500);
                                        }
                                    }}
                                    inputRef={keywordInputRef}
                                    sx={{ width: "100%" }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            }
                        />
                        <IconButton ref={keywordSearchBtnRef} disabled={debounceKeyword === ""} onClick={onSearch} aria-label="search" size="small" sx={{ borderRadius: "5px", marginLeft: "0.5rem", border: "1px solid gray" }}>
                            <SearchIcon sx={{ padding: "3px" }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>


                        <Box sx={{ width: "80%" }}>
                            {/* Job Market */}
                            <Box>
                                <Box >
                                    <Box sx={{marginLeft: '1rem'}}>

                                        {(state?.companyRows) && (
                                            <StripedDataTable
                                                currentPage={state.pageCompanyTable > 0 ? state.pageCompanyTable : 1}
                                                onChangePageSizeOptions={(limit) => {
                                                    setLimitCompanyTable(limit)
                                                }}
                                                getHeight={true}
                                                handlePage={(page) => {
                                                    dispatch({
                                                        type: 'SET_PAGE_COMPANY',
                                                        payload: page
                                                    })
                                                }}
                                                rowCount={state.totalDocsCompanyTable}
                                                rows={state.rowsCompanyTable && state.rowsCompanyTable.length > 0 ? state.rowsCompanyTable : []}
                                                columns={companyColumns()}
                                                loading={state.loadingCompanyTable}
                                                sortingMode="server"
                                                sortModel={sortCompanyTable}
                                                onSortModelChange={(newSortModel) => setSortCompanyTable(newSortModel)}
                                                autoHeight={true}
                                                checkboxSelection={false}
                                                pageSize={limitCompanyTable}
                                                columnVisibilityModel={companyColumnVisibility}
                                                onColumnVisibilityModelChange={(newModel: GridColumnVisibilityModel) =>
                                                    setCompanyColumnVisibility(newModel)
                                                }
                                                customToolbar={
                                                    <CustomToolbar
                                                        filtersButton={false}
                                                        sortButton={false}
                                                        exportButton={false}
                                                        // handleGetAllData={handleGetAllCompany}
                                                        inputValue={inputValue}
                                                        setInputValue={setInputValue}
                                                        companyColumnVisibility={companyColumnVisibility}
                                                    />}
                                                errorStatus={state.errorStatusCompany}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                </Box >
            </Box >

        </StyledComponent>
    )
}

export default Training
