import { useState, useCallback } from 'react';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _nodos } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';



import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';


import  NodoTable from 'src/components/NodoTable';
import AddNodeForm from 'src/components/AddNodeForm';
import EditNodeForm from 'src/components/EditNodeForm';



import { emptyRows, applyFilter, getComparator } from '../utils';

import type { NodoProps } from '../nodo-table-row';


// ----------------------------------------------------------------------

export function NodoView() {
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);
  const [showEditNodeForm, setShowEditNodeForm] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const handleShowAddForm = () => {
    setShowAddNodeForm(true);
    setShowEditNodeForm(false);
  };

  const handleShowEditForm = (nodeId: number) => {
    setSelectedNodeId(nodeId);
    setShowEditNodeForm(true);
    setShowAddNodeForm(false);
  };

  const handleHideForms = () => {
    setShowAddNodeForm(false);
    setShowEditNodeForm(false);
    setSelectedNodeId(null);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Nodos
        </Typography>
        {!showAddNodeForm && !showEditNodeForm && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleShowAddForm}
            sx={{ mt: 2, ml: 2 }}
          >
            Agregar nodo
          </Button>
        )}
      </Box>

      <Box sx={{ padding: 2 }}>
        {showAddNodeForm ? (
          <AddNodeForm onCancel={handleHideForms} />
        ) : showEditNodeForm && selectedNodeId !== null ? (
          <EditNodeForm
            nodeId={selectedNodeId}
            onClose={handleHideForms}
            onUpdate={() => console.log("Node updated!")}
          />
        ) : (
          <NodoTable onEditNode={handleShowEditForm} />
        )}



      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
