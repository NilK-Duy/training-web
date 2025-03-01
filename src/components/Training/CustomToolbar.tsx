import { GridToolbarContainer, GridToolbarColumnsButton, GridColumnVisibilityModel, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Button, TextField, Box, IconButton, Menu, Typography, FormControl, Grid, Badge, Autocomplete } from '@mui/material';
import { useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const CustomToolbar = (props: {
  filtersButton?: boolean,
  sortButton?: boolean,
  removeButton?: boolean,
  exportButton?: boolean,
  exportFileCSVButton?: boolean,
  rowsSelected?: string[],
  handleFilterByKeyword?: () => void, 
  handleRemoveCompanies?: () => void, 
  handleGetAllData?: () => void,
  handleClickExportCsvGetAllData?: () => void,
  rowsCompanyTable?: any[], 
  searchParams?: any , 
  companiesRemove?: string[] , 
  handleAddCompaniesAndRemove?: () => void,
  inputValue?: string,
  setInputValue?: (value: string) => void,
  trainingColumnVisibility?: GridColumnVisibilityModel,
}) => {
  const {
    filtersButton = false, 
    sortButton = false, 
    removeButton = false, 
    exportButton = false,
    exportFileCSVButton = false,
    rowsSelected = [], 
    handleRemoveCompanies = () => {}, 
    handleClickExportCsvGetAllData = () => {},
    rowsCompanyTable = [], 
    searchParams = {}, 
    companiesRemove = [], 
    handleGetAllData = () => {}, 
    handleFilterByKeyword = () => {}, 
    inputValue = "",
    setInputValue = () => {},
    handleAddCompaniesAndRemove = () => {}
} = props;


   // State for Menu
  const customColor = '#1976d2'
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  // State for filters
  const [jobsFilterMin, setJobsFilterMin] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsFilterMin");
    return value !== null ? Number(value) : null;
  });
  const [jobsFilterMax, setJobsFilterMax] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsFilterMax");
    return value !== null ? Number(value) : null;
  });
  const [jobsMaxAgeFilterMin, setJobsMaxAgeFilterMin] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsMaxAgeFilterMin");
    return value !== null ? Number(value) : null;
  });
  const [jobsMaxAgeFilterMax, setJobsMaxAgeFilterMax] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsMaxAgeFilterMax");
    return value !== null ? Number(value) : null;
  });
  const [jobsMinAgeFilterMin, setJobsMinAgeFilterMin] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsMinAgeFilterMin");
    return value !== null ? Number(value) : null;
  });
  const [jobsMinAgeFilterMax, setJobsMinAgeFilterMax] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsMinAgeFilterMax");
    return value !== null ? Number(value) : null;
  });
  const [jobsAvgAgeFilterMin, setJobsAvgAgeFilterMin] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsAvgAgeFilterMin");
    return value !== null ? Number(value) : null;
  });
  const [jobsAvgAgeFilterMax, setJobsAvgAgeFilterMax] = useState<number | null>(() => {
    const value = sessionStorage.getItem("jobsAvgAgeFilterMax");
    return value !== null ? Number(value) : null;
  });
  const [sizeFilterMin, setSizeFilterMin] = useState<number | null>(() => {
    const value = sessionStorage.getItem("sizeFilterMin");
    return value !== null ? Number(value) : null;
  });
  const [sizeFilterMax, setSizeFilterMax] = useState<number | null>(() => {
    const value = sessionStorage.getItem("sizeFilterMax");
    return value !== null ? Number(value) : null;
  });
  const [revenueFilterMin, setRevenueFilterMin] = useState<number | null>(() => {
    const value = sessionStorage.getItem("revenueFilterMin");
    return value !== null ? Number(value) : null;
  });
  const [revenueFilterMax, setRevenueFilterMax] = useState<number | null>(() => {
    const value = sessionStorage.getItem("revenueFilterMax");
    return value !== null ? Number(value) : null;
  });
  const [companyFilter, setCompanyFilter] = useState(() => {
    return sessionStorage.getItem("companyFilter") ?? "";
  });
  const [businessAreaFilter, setBusinessAreaFilter] = useState(() => {
    return sessionStorage.getItem("businessAreaFilter") ?? "";
  });

  // Badge
  const showFilterBadge = 
  jobsFilterMin != null ||
  jobsFilterMax != null ||
  jobsMaxAgeFilterMin != null ||
  jobsMaxAgeFilterMax != null ||
  jobsMinAgeFilterMin != null ||
  jobsMinAgeFilterMax != null ||
  jobsAvgAgeFilterMin != null ||
  jobsAvgAgeFilterMax != null ||
  sizeFilterMin != null ||
  sizeFilterMax != null ||
  revenueFilterMin != null ||
  revenueFilterMax != null ||
  companyFilter.trim() !== "" ||
  businessAreaFilter.trim() !== "";


const [valuesortFields, setValuesortFields] = useState<string>(() => {
    return sessionStorage.getItem("sortFields") || "";
});
const showSortBadge = valuesortFields.trim().replace(/,/g, "") !== "";

const openFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
  setFilterMenuAnchor(event.currentTarget);
};

const closeFilterMenu = () => {
  setFilterMenuAnchor(null);
};


  interface SortLevel {
    column: string;
    sortOn: string;
    order: string;
    customOrder?: string
  }
  
  const [sortLevels, setSortLevels] = useState<SortLevel[]>(() => {
    const savedSortLevels = sessionStorage.getItem("sortLevels");
    return savedSortLevels ? JSON.parse(savedSortLevels) : [{ column: "", sortOn: "Values", order: "" }];
  });
  const columnOptions = [
    { label: "Jobs", value: "jobs" },
    { label: "Max Age Job", value: "maxAge" },
    { label: "Min Age Job", value: "minAge" },
    { label: "Avg Age Job", value: "avgAge" },
    { label: "Size", value: "size" },
    { label: "Revenue", value: "revenue" },
    { label: "Date", value: "updatedAt" },
  ];
  const orderOptions = [
    { label: "A to Z", value: "asc" },
    { label: "Z to A", value: "desc" },
    { label: "Custom list", value: "custom"}
  ];
  

  const openSortMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const closeSortMenu = () => {
    setSortMenuAnchor(null);
  };

  const addSortLevel = () => {
    setSortLevels([...sortLevels, { column: "", sortOn: "Values", order: "" }]);
  };
  const deleteSortLevel = (index: any) => {
    setSortLevels(sortLevels.filter((_, i) => i !== index));
  };

  const clearSorting = () => {
    setSortLevels([{ column: "", sortOn: "Values", order: "" }]);
    sessionStorage.removeItem("sortLevels");
    sessionStorage.removeItem("sortFields");
    sessionStorage.removeItem("sortOrders");
    handleFilterByKeyword()
  };


  // Function to apply filters
  const applyFilters = () => {
    const filters = {
      jobsFilterMin,
      jobsFilterMax,
      sizeFilterMin,
      sizeFilterMax,
      revenueFilterMin,
      revenueFilterMax,
      companyFilter,
      businessAreaFilter,
      jobsMaxAgeFilterMin,
      jobsMaxAgeFilterMax,
      jobsMinAgeFilterMin,
      jobsMinAgeFilterMax,
      jobsAvgAgeFilterMin,
      jobsAvgAgeFilterMax,
    };
  
    const isAllFiltersEmpty = Object.values(filters).every(value => value == null || value === '');
  
    if (isAllFiltersEmpty) {
      Object.keys(filters).forEach(key => sessionStorage.removeItem(key));
      return;
    }
  
    Object.entries(filters).forEach(([key, value]) => {
      if (value == null || value === '') {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value.toString());
      }
    });
  
    handleFilterByKeyword();
  };


// Function to clear filters
const clearFilters = () => {
  setJobsFilterMin(null);
  setJobsFilterMax(null);
  setSizeFilterMin(null);
  setSizeFilterMax(null);
  setRevenueFilterMin(null);
  setRevenueFilterMax(null);
  setCompanyFilter('');
  setJobsMaxAgeFilterMin(null);
  setJobsMaxAgeFilterMax(null);
  setJobsMinAgeFilterMin(null);
  setJobsMinAgeFilterMax(null);
  setJobsAvgAgeFilterMin(null);
  setJobsAvgAgeFilterMax(null);

  sessionStorage.removeItem('jobsFilterMin');
  sessionStorage.removeItem('jobsFilterMax');
  sessionStorage.removeItem('sizeFilterMin');
  sessionStorage.removeItem('sizeFilterMax');
  sessionStorage.removeItem('revenueFilterMin');
  sessionStorage.removeItem('revenueFilterMax');
  sessionStorage.removeItem('companyFilter');
  sessionStorage.removeItem('businessAreaFilter');
  sessionStorage.removeItem('jobsMaxAgeFilterMin');
  sessionStorage.removeItem('jobsMaxAgeFilterMax');
  sessionStorage.removeItem('jobsMinAgeFilterMin');
  sessionStorage.removeItem('jobsMinAgeFilterMax');
  sessionStorage.removeItem('jobsAvgAgeFilterMin');
  sessionStorage.removeItem('jobsAvgAgeFilterMax');

  handleFilterByKeyword()
};




const handleApplySorting = () => {
  const validSortLevels = sortLevels.filter(
    (level) => level.column.trim() !== "" && level.order.trim() !== ""
  );
  if (validSortLevels.length === 0) {
    closeSortMenu();
    return;
  }

  const sortedFields = validSortLevels.map(level => level.column);
  const sortedOrders = validSortLevels.map(level => {
    if (level.order === "custom" && level.customOrder) {
      return `[${level.customOrder}]`; //  []
    }
    return level.order;
  });

  
  sessionStorage.setItem("sortLevels", JSON.stringify(validSortLevels));
  sessionStorage.setItem("sortFields", sortedFields.join(","));
  sessionStorage.setItem("sortOrders", sortedOrders.join(","));

 
  handleFilterByKeyword();

  closeSortMenu();
};

const handleDragEnd = (result: any) => {
  if (!result.destination) return; 
  const newLevels = [...sortLevels];
  const [reorderedItem] = newLevels.splice(result.source.index, 1);
  newLevels.splice(result.destination.index, 0, reorderedItem);

  setSortLevels(newLevels);
};

  return (
    <GridToolbarContainer>
      <Box display="flex" alignItems="center" gap={2}>
        <GridToolbarColumnsButton />

        {filtersButton ? (
          <>
            {/* Multi-Filter Icon Button */}
            <IconButton onClick={openFilterMenu} sx={{
              color: customColor,
              '&:hover': {
                backgroundColor: '#f6fafd',
                borderRadius: 1,
              },
              '&:active': {
                backgroundColor: '#f6fafd',
                borderRadius: 1,
              }
            }}>
              <Badge color="primary" variant="dot" invisible={!showFilterBadge}>
                <FilterListIcon />
              </Badge>
              <Typography variant="button" sx={{ ml: 1 }}>Filters</Typography>
            </IconButton>

            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={closeFilterMenu}
              sx={{ mt: 1 }}
            >
              <Box sx={{ width: 300, padding: 2 }}>
                <Grid container spacing={2}>
                  
                  {/* Jobs Field */}
                  <Grid item xs={13}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Jobs</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Min"
                          type="number"
                          value={jobsFilterMin ?? ''}
                          onChange={(e) => setJobsFilterMin(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6">-</Typography>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Max"
                          type="number"
                          value={jobsFilterMax ?? ''}
                          onChange={(e) => setJobsFilterMax(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={13}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Max age job</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Min"
                          type="number"
                          value={jobsMaxAgeFilterMin ?? ''}
                          onChange={(e) => setJobsMaxAgeFilterMin(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6">-</Typography>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Max"
                          type="number"
                          value={jobsMaxAgeFilterMax ?? ''}
                          onChange={(e) => setJobsMaxAgeFilterMax(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={13}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Min age job</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Min"
                          type="number"
                          value={jobsMinAgeFilterMin ?? ''}
                          onChange={(e) => setJobsMinAgeFilterMin(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6">-</Typography>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Max"
                          type="number"
                          value={jobsMinAgeFilterMax ?? ''}
                          onChange={(e) => setJobsMinAgeFilterMax(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={13}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Avg age job</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Min"
                          type="number"
                          value={jobsAvgAgeFilterMin ?? ''}
                          onChange={(e) => setJobsAvgAgeFilterMin(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6">-</Typography>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Max"
                          type="number"
                          value={jobsAvgAgeFilterMax ?? ''}
                          onChange={(e) => setJobsAvgAgeFilterMax(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Size Field */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Size Employee</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Min"
                          type="number"
                          value={sizeFilterMin ?? ''}
                          onChange={(e) => setSizeFilterMin(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6">-</Typography>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Max"
                          type="number"
                          value={sizeFilterMax ?? ''}
                          onChange={(e) => setSizeFilterMax(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Revenue Field */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Revenue</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Min"
                          type="number"
                          value={revenueFilterMin ?? ''}
                          onChange={(e) => setRevenueFilterMin(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6">-</Typography>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          label="Max"
                          type="number"
                          value={revenueFilterMax ?? ''}
                          onChange={(e) => setRevenueFilterMax(e.target.value === '' ? null : Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Company Field */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Company</Typography>
                    <TextField
                      placeholder="Company name"
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  {/* Business Area Field */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Business Area</Typography>
                    <TextField
                      placeholder="consulting, manufacturer..."
                      value={businessAreaFilter}
                      onChange={(e) => setBusinessAreaFilter(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>

                </Grid>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button variant="contained" color="primary" onClick={applyFilters}>Filter</Button>
                  <Button variant="outlined" color="error" onClick={clearFilters}>Clear</Button>
                </Box>
              </Box>
            </Menu>
          </>
        ) : (
          <GridToolbarFilterButton />
        )}

        {sortButton && (
          <>
            {/* Multi-Sort Icon Button */}
            <IconButton onClick={openSortMenu} sx={{
              color: customColor,
              '&:hover': {
                backgroundColor: '#f6fafd',
                borderRadius: 1,
              },
              '&:active': {
                backgroundColor: '#f6fafd',
                borderRadius: 1,
              }
            }}>
              <Badge color="primary" variant="dot" invisible={!showSortBadge}>
                <SortIcon />
              </Badge>
              <Typography variant="button" sx={{ ml: 1 }}>Sort</Typography>
            </IconButton>

            <Menu anchorEl={sortMenuAnchor} open={Boolean(sortMenuAnchor)} onClose={closeSortMenu} sx={{ mt: 1 }}>
              <Box sx={{padding: 2 }}>
              
                
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sortLevels">
                  {(provided: any) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                      {sortLevels.map((level, index) => (
                        <Draggable key={index} draggableId={index.toString()} index={index}>
                          {(provided: any) => (
                            <Box 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              {...provided.dragHandleProps}
                              sx={{ display: "flex", gap:1, justifyContent: 'space-between', mt: 2, alignItems: "center", padding: 1, borderRadius: "4px" }}
                            >
                              <Box><Typography>{index === 0 ? "Sort by" : "Then by"}</Typography></Box>
                              
                              <Box sx= {{display: "flex", alignItems: "center", gap: 1}}>
                                <FormControl sx={{ minWidth: 140 }}>
                                  <Autocomplete
                                    disablePortal
                                    options={columnOptions}
                                    getOptionLabel={(option) => option.label}
                                    sx={{ minWidth: 120 }}
                                    value={columnOptions.find((opt) => opt.value === level.column) || null}
                                    onChange={(_, newValue) => {
                                      if (newValue) {
                                        const newLevels = [...sortLevels];
                                        newLevels[index].column = newValue.value;
                                        setSortLevels(newLevels);
                                      }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Column" />}
                                  />
                                </FormControl>
            
                                <FormControl sx={{ minWidth: 140 }}>
                                  <Autocomplete
                                    disablePortal
                                    options={orderOptions}
                                    getOptionLabel={(option) => option.label}
                                    sx={{ minWidth: 120 }}
                                    value={orderOptions.find((opt) => opt.value === level.order) || null}
                                    onChange={(_, newValue) => {
                                      if (newValue) {
                                        const newLevels = [...sortLevels];
                                        newLevels[index].order = newValue.value;
                                    
                                        if (newValue.value === "custom") {
                                          newLevels[index].customOrder = "";
                                        } else {
                                          delete newLevels[index].customOrder;
                                        }
                                        setSortLevels(newLevels);
                                      }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Order" />}
                                  />
                                </FormControl>
                                {level.order === "custom" && (
                                  <TextField
                                    sx={{ minWidth: 200 }}
                                    label="Ex: 203,98"
                                    value={level.customOrder || ""}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[0-9,]*$/.test(inputValue)) { // Allow only numbers and commas
                                        const newLevels = [...sortLevels];
                                        newLevels[index].customOrder = inputValue;
                                        setSortLevels(newLevels);
                                    }
                                    }}
                                  />
                                )}
            
                                <Button onClick={() => deleteSortLevel(index)} disabled={sortLevels.length === 1} sx={{minWidth: 0}}>
                                  X
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
                
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button 
                    variant="contained" 
                    onClick={addSortLevel}
                    disabled={sortLevels.length >= 10}
                  >
                    Add Level
                  </Button>
                  <Box>
                    <Button
                      variant="outlined" 
                      onClick={clearSorting} 
                      sx={{ mr: 1 }}
                    >
                      Clear
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleApplySorting}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Menu>
          </>
        )}

        {removeButton && (
          <Button 
            style={{margin: "5px"}} 
            disabled={rowsSelected.length > 0 && rowsSelected.some(
              (row) => !companiesRemove.includes(row)
          ) ? false : true}
            variant="outlined" 
            color="error" 
            size="small" 
            onClick={() => handleRemoveCompanies()}
          >
            Remove companies
          </Button>
        )}

        {/* {exportButton && (
          <Button style={{ margin: "5px", border: "outset" }} onClick={handleGetAllData} >
            Export file xlsx
          </Button>
        )} */}
        {exportButton && (
          <Button 
            style={{margin: "5px"}} 
           
            variant="outlined" 
            color="primary" 
            size="small" 
            onClick={handleGetAllData}
          >
            Export file xlsx
          </Button>
        )}
        {/* {exportFileCSVButton && (
          <Button style={{ margin: "5px", border: "outset" }} onClick={handleClickExportCsvGetAllData} >
            Export file CSV
          </Button>
        )} */}
       {exportFileCSVButton && (
          <Button 
            style={{margin: "5px"}} 
           
            variant="outlined" 
            color="primary" 
            size="small" 
            onClick={handleClickExportCsvGetAllData}
          >
            Export file CSV
          </Button>
        )}

        
      </Box>
    </GridToolbarContainer>
  );
};
export default CustomToolbar
