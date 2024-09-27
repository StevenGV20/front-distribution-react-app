import {
  MenuItem,
  Pagination,
  Select,
  Stack,
  TablePagination,
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";

const PaginationCustom = ({
  totalRows,
  children,
  fetchData,
  orderByList,
  refreshTable,
  showLimit = false,
}) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = React.useState(1);
  const [orderBy, setOrderBy] = useState("0");

  useEffect(() => {
    setLimit(10);
    setPage(1);
  }, [refreshTable]);

  const handleChange = (event, value) => {
    setPage(value);
    fetchData(parseInt(value) === 0 ? 1 : value, limit, orderBy);
  };

  const handleChangeMobile = (event, value) => {
    setPage(value);
    fetchData(parseInt(value) + 1, limit, orderBy);
  };

  const handleChangeLimit = (e) => {
    setLimit(e.target.value);
    setPage(1);
    fetchData(1, e.target.value, orderBy);
  };

  const handleChangeOrderBy = (e) => {
    setOrderBy(e.target.value);
    fetchData(page, limit, e.target.value);
  };

  const handleChangeOrderByMoble = (e) => {
    setOrderBy(e.target.value);
    fetchData(page + 1, limit, e.target.value);
  };

  const handleChangeLimitMobile = (e) => {
    setLimit(e.target.value);
    setPage(0);
    fetchData(1, e.target.value, orderBy);
  };

  const PaginationPartial = () => (
    <>
      <div className="flex desktop">
        <div className="flex space-x-4 place-items-center">
          <div className="flex space-x-4 place-items-center">
            {showLimit && (
              <>
                <div>Mostrar:</div>
                <Select
                  value={limit}
                  id="demo-select-small"
                  onChange={(e) => handleChangeLimit(e)}
                  sx={{padding:"0em"}}
                  size="small"
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
                <div>
                  {limit * (page - 1) + 1} -{" "}
                  {limit * page > totalRows ? totalRows : limit * page} de{" "}
                  {totalRows} filas
                </div>
              </>
            )}
          </div>
          <div className="grow flex justify-center pagination">
            <Stack spacing={2}>
              <Pagination
                count={totalRows ? Math.ceil(totalRows / limit) : 1}
                showFirstButton
                showLastButton
                page={page}
                shape="rounded"
                onChange={handleChange}
              />
            </Stack>
          </div>

          {orderByList && (
            <div className="flex space-x-4 place-items-center left-0">
              <div>Ordenar por:</div>
              <Select
                value={orderBy}
                id="demo-select-small"
                onChange={(e) => handleChangeOrderBy(e)}
              >
                <MenuItem value={"0"}>[Seleccione]</MenuItem>
                {orderByList.map((o) => (
                  <MenuItem value={o.value} key={o.value}>{o.name}</MenuItem>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center mobile">
        <TablePagination
          component="div"
          count={totalRows ? totalRows : 1}
          page={totalRows ? page : 0}
          rowsPerPage={limit}
          onPageChange={handleChangeMobile}
          onRowsPerPageChange={handleChangeLimitMobile}
          labelRowsPerPage={"Mostrar"}
        />
        {orderByList && (
          <div className="w-full flex space-x-4 items-center px-2">
            <div>Ordenar por:</div>
            <select
              value={orderBy}
              id="demo-select-small"
              onChange={(e) => handleChangeOrderByMoble(e)}
              className="border-b-2 border-gray-500 px-2 py-1"
            >
              <option value={"0"}>[Seleccione]</option>
              {orderByList.map((o) => (
                <option value={o.value} key={o.value}>{o.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div>
      {/* <PaginationPartial /> */}
      {children}
      <PaginationPartial />
    </div>
  );
};

export default PaginationCustom;
