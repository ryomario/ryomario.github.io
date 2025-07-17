import Box from "@mui/material/Box";
import { paginationClasses } from "@mui/material/Pagination";
import { useCallback, useEffect, useState } from "react";
import { Logger } from "@/utils/logger";
import * as RepoLicensesServer from "@/db/repositories/RepoLicenses.server";
import { LoadingScreen } from "@/components/loadingScreen/LoadingScreen";
import Card from "@mui/material/Card";
import { ILicense, ILicenseFilter, ILicenseSortableProperties } from "@/types/ILicense";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { ArrayOrder } from "@/lib/array";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { AdminLicenseItem } from "./adminLicenseItem";
import Skeleton from "@mui/material/Skeleton";
import { useTableData, UseTableLoadData } from "@/hooks/tableData";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from "@/hooks/debouncedValue";

type Props = {
  itemPerPage?: number;
  getRedirectPathEdit: (id: string) => string;
}

export function AdminLicenseList({
  itemPerPage = 5,
  getRedirectPathEdit,
}: Props) {
  const [searchInput, setSearchInput] = useState('');
  const searchQuery = useDebounce(searchInput, 300);

  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback<UseTableLoadData<ILicense, ILicenseSortableProperties>>(async (offset, limit, order, orderBy) => {
    try {
      const filter: ILicenseFilter = { q: searchQuery };
      const countData = await RepoLicensesServer.getCountByFilter(filter);
      const loadedData = await RepoLicensesServer.getAllByFilter(filter, offset, limit, order, orderBy);

      return {
        data: loadedData,
        total: countData,
      }
    } catch (error) {
      return {
        data: [],
        total: 0,
      }
    }
  }, [searchQuery]);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pageSize,
    order,
    orderBy,
    handleRequestSort,

    data,
    isLoading,
    total,
    refresh,
  } = useTableData<ILicense, ILicenseSortableProperties>({
    orderBy: 'name',
    pageSize: itemPerPage,
    data: loadData,
  });


  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      const result = await RepoLicensesServer.remove(id);
      if (!result) {
        throw new Error('Internal error');
      }

      Logger.debug(id, 'DELETE license');
      refresh();
    } catch (error: any) {
      Logger.error(error, 'DELETE license');
    } finally {
      setIsDeleting(false);
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [searchQuery]);

  if (isDeleting) {
    return <LoadingScreen />;
  }

  return <>
    <Card>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: 1,
          my: 2
        }}
      >
        <TextField
          sx={{ ml: 'auto' }}
          placeholder="Search..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }
          }}
        />
      </Toolbar>
      <TableContainer>
        <Table
          sx={{ minWidth: 500 }}
        >
          <LicenseTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {
              isLoading
                ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell width={150}>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell width={200}>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell width={80}>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))
                : data.map((row, i) => (
                  <AdminLicenseItem
                    key={i}
                    data={row}
                    editHref={getRedirectPathEdit(`${row.id}`)}
                    onDelete={() => handleDelete(row.id)}
                  />
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        page={page}
        count={total}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        sx={{
          [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
        }}
      />
    </Card>
  </>;
}

interface LicenseTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: ILicenseSortableProperties) => void;
  order: ArrayOrder;
  orderBy: ILicenseSortableProperties;
}
interface HeaderCellProps {
  id: keyof ILicense;
  sortBy?: ILicenseSortableProperties;
  label: string;
  align?: 'right' | 'left' | 'center';
  disablePadding?: boolean;
}

function LicenseTableHead({
  order,
  orderBy,
  onRequestSort,
}: LicenseTableHeadProps) {
  const createSortHandler =
    (property: ILicenseSortableProperties) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const renderHeaderCell = ({ id, sortBy, label, align = 'left', disablePadding = false }: HeaderCellProps) => (
    <TableCell
      key={id}
      align={align}
      padding={disablePadding ? 'none' : 'normal'}
      sortDirection={orderBy === sortBy ? order : false}
    >
      {
        !!sortBy
          ? (
            <TableSortLabel
              active={orderBy === sortBy}
              direction={orderBy === sortBy ? order : 'asc'}
              onClick={createSortHandler(sortBy)}
            >
              {label}
              {orderBy === sortBy ? (
                <Box component="span" sx={{ width: 0, height: 0, visibility: 'hidden' }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          )
          : label
      }
    </TableCell>
  );

  return (
    <TableHead>
      <TableRow>
        {renderHeaderCell({ id: 'name', sortBy: 'name', label: 'Name' })}
        {renderHeaderCell({ id: 'startDate_year', sortBy: 'issueDate', label: 'Issue Date' })}
        {renderHeaderCell({ id: 'endDate_year', sortBy: 'expirationDate', label: 'Expiration Date' })}
        <TableCell width={1}></TableCell>
      </TableRow>
    </TableHead>
  );
}