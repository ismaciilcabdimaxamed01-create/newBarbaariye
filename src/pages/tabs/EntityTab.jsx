import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { swalSuccess, swalConfirm, swalError } from '../../utils/swal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import ActionButton from '../../components/ui/ActionButton';
import DataTableCard from '../../components/DataTableCard';
import { CRUD_CONFIG } from '../../config/crudConfig';
import {
  loadData,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  selectEntity,
  selectColumns,
  selectPaginatedData,
  selectTotalPages,
  selectTotalRows,
} from '../../slices/dataSlice';
import { deleteRow } from '../../utils/crud';

const toLabel = (key) => key.charAt(0).toUpperCase() + key.slice(1, -1);

// Search ma la dirin database – kaliya table-ka (client-side) ayaa la filter-garaynayaa
const loadPayload = (entityKey, page, limit) => ({
  queryName: entityKey,
  page,
  limit: limit || 10,
});

export default function EntityTab({ entityKey, modalKey, icon: Icon, loadButtons, dispatch, onEdit }) {
  const entity = useSelector(selectEntity(entityKey)) ?? {};
  const columns = useSelector(selectColumns(entityKey));
  const paginatedData = useSelector(selectPaginatedData(entityKey));
  const totalPages = useSelector(selectTotalPages(entityKey));
  const totalRows = useSelector(selectTotalRows(entityKey)) ?? paginatedData?.length ?? 0;

  const config = CRUD_CONFIG[modalKey];
  const label = toLabel(entityKey);
  const loadBtns = loadButtons ?? [{ id: entityKey, label: `Load ${label}` }];
  const limit = entity.itemsPerPage || 10;
  const [showDataPanel, setShowDataPanel] = useState(false);

  const onShowData = useCallback(
    (btnId) => {
      setShowDataPanel(true);
      dispatch(loadData(loadPayload(btnId, 1, limit)));
    },
    [limit, dispatch]
  );

  const doDelete = useCallback(
    async (row) => {
      try {
        await deleteRow(row, config, () => {
          dispatch(loadData(loadPayload(entityKey, 1, limit)));
          swalSuccess('Wa la guulaystey', 'Xogtada waa la tirtay.');
        });
      } catch (err) {
        swalError('Khalad ayaa dhacay', err.message || 'Tirtirku wuu ku fashilmay.');
      }
    },
    [config, entityKey, limit, dispatch]
  );

  const goToPage = useCallback(
    (page) => {
      dispatch(setCurrentPage({ entityKey, value: page }));
      dispatch(loadData(loadPayload(entityKey, page, limit)));
    },
    [entityKey, limit, dispatch]
  );

  const handlePageSizeChange = useCallback(
    (newSize) => {
      dispatch(setItemsPerPage({ entityKey, value: newSize }));
      dispatch(loadData(loadPayload(entityKey, 1, newSize)));
      dispatch(setCurrentPage({ entityKey, value: 1 }));
    },
    [entityKey, dispatch]
  );

  const renderActions = useCallback(
    (row) => (
      <div className="flex justify-center gap-1">
        <ActionButton variant="edit" aria-label="Edit" onClick={() => onEdit(modalKey)(row)}>
          <Pencil className="w-4 h-4" />
        </ActionButton>
        <ActionButton
          variant="delete"
          aria-label="Delete"
          onClick={async () => {
            if (await swalConfirm()) doDelete(row);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </ActionButton>
      </div>
    ),
    [modalKey, onEdit, doDelete]
  );

  const headerActions = (
    <>
      {loadBtns.map((btn) => {
        const BtnIcon = btn.icon ?? Icon;
        const isAddNew = !!btn.modalKey;
        return (
          <Button
            key={btn.id}
            size="sm"
            variant="primary"
            leftIcon={<BtnIcon className="w-4 h-4" />}
            onClick={() =>
              isAddNew ? onEdit(btn.modalKey)(null) : onShowData(btn.id)
            }
            disabled={!isAddNew && entity.isLoading}
          >
            {isAddNew ? 'ADD NEW' : 'SHOW DATA'}
          </Button>
        );
      })}
      {!loadBtns.some((b) => b.modalKey) && modalKey && (
        <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => onEdit(modalKey)(null)}>
          ADD NEW
        </Button>
      )}
    </>
  );

  const emptyDesc =
    loadBtns.length > 1 ? 'Click a button to load or Add to create' : `Click Load ${label} or Add to create`;

  const handleSearchSubmit = useCallback(() => {
    dispatch(loadData(loadPayload(entityKey, 1, limit, entity.searchQuery)));
  }, [entityKey, limit, entity.searchQuery, dispatch]);

  return (
    <DataTableCard
      showDataPanel={showDataPanel}
      searchPlaceholder={`Search ${label.toLowerCase()}...`}
      searchValue={entity.searchQuery}
      onSearchChange={(e) => dispatch(setSearchQuery({ entityKey, value: e.target.value }))}
      onSearchSubmit={handleSearchSubmit}
      headerActions={headerActions}
      emptyTitleClickToLoad={`No ${label.toLowerCase()} loaded`}
      emptyDescClickToLoad={loadBtns.length > 1 ? 'Click a button above to load or Add to create' : `Click "SHOW DATA" above to load ${label.toLowerCase()}.`}
      emptyIconClickToLoad={Icon}
      columns={columns?.length ? columns : [{ key: 'id', label: 'ID' }]}
      data={paginatedData}
      isLoading={entity.isLoading}
      error={entity.error}
      errorHint="Backend: npm start. DB: npm run init-db"
      emptyIcon={Icon}
      emptyTitle={`No ${label.toLowerCase()} loaded`}
      emptyDescription={emptyDesc}
      hasActions
      renderActions={renderActions}
      total={totalRows}
      currentPage={entity.currentPage}
      totalPages={totalPages}
      itemsPerPage={limit}
      onPreviousPage={() => goToPage(Math.max(1, entity.currentPage - 1))}
      onNextPage={() => goToPage(Math.min(totalPages, entity.currentPage + 1))}
      onPageClick={goToPage}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
