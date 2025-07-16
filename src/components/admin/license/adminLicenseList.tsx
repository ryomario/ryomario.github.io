import { IWorkExperience } from "@/types/IWorkExperience"
import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import { useCallback, useEffect, useState } from "react";
import { Logger } from "@/utils/logger";
import * as RepoLicensesServer from "@/db/repositories/RepoLicenses.server";
import { LoadingScreen } from "@/components/loadingScreen/LoadingScreen";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import { ILicense, ILicenseFilter, ILicenseSortableProperties } from "@/types/ILicense";
import { usePagination } from "@/hooks/pagination";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { ArrayOrder } from "@/lib/array";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import Button from "@mui/material/Button";
import { useTableOrder } from "@/hooks/tableOrder";
import { AdminLicenseItem } from "./adminLicenseItem";
import Skeleton from "@mui/material/Skeleton";

type Props = {
  itemPerPage?: number;
  getRedirectPathEdit: (id: string) => string;
}

export function AdminLicenseList({
  itemPerPage = 10,
  getRedirectPathEdit,
}: Props) {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<ILicense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    limit,
    offset,
    pageSize,
  } = usePagination({
    pageSize: itemPerPage,
  });
  const {
    order,
    orderBy,
    handleRequestSort,
  } = useTableOrder<ILicenseSortableProperties>({ orderBy: 'name' });


  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const filter: ILicenseFilter = { q: '' };
      const countData = await RepoLicensesServer.getCountByFilter(filter);
      const loadedData = await RepoLicensesServer.getAllByFilter(filter, offset, limit, order, orderBy);

      setCount(countData);
      setData(loadedData);
    } catch (error) {
      setCount(0);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [offset, limit, order, orderBy, setCount, setData, setIsLoading]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      const result = await RepoLicensesServer.remove(id);
      if (!result) {
        throw new Error('Internal error');
      }

      Logger.debug(id, 'DELETE license');
      loadData();
    } catch (error: any) {
      Logger.error(error, 'DELETE license');
    } finally {
      setIsDeleting(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
    console.log(page, pageSize)
  }, [page, pageSize, order, orderBy]);

  if(isDeleting) {
    return <LoadingScreen/>;
  }

  return <>
    <Card>
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
                    <Skeleton variant="text"/>
                  </TableCell>
                  <TableCell width={150}>
                    <Skeleton variant="text"/>
                  </TableCell>
                  <TableCell width={200}>
                    <Skeleton variant="text"/>
                  </TableCell>
                  <TableCell width={80}>
                    <Skeleton variant="text"/>
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
        rowsPerPageOptions={[2, 5, 10, 25]}
        component="div"
        page={page}
        count={count}
        rowsPerPage={pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        sx={{
          // mt: 8,
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
  align?: 'right'|'left'|'center';
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