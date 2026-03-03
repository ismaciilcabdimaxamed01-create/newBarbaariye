import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import CrudModal from '../modals/CrudModal';
import { EntityTab } from './tabs';
import { CRUD_CONFIG } from '../config/crudConfig';
import { getTabsForPath } from '../config/menuConfig';
import { getModalEntities, getQueryForModalKey } from '../utils/tabModalUtils';
import { loadData } from '../slices/dataSlice';
import { setActiveTab } from '../slices/uiSlice';

const motionProps = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } };

export default function PeopleSection() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [modal, setModal] = useState({ entityKey: null, editRow: null });

  const tabs = getTabsForPath(location.pathname);
  const { activeTab } = useSelector((state) => state.ui);
  const activeTabConfig = tabs.find((t) => t.id === activeTab);
  const modalEntities = getModalEntities(tabs);

  useEffect(() => {
    if (tabs.length && !tabs.some((t) => t.id === activeTab)) {
      dispatch(setActiveTab(tabs[0].id));
    }
  }, [location.pathname, tabs, activeTab, dispatch]);

  const openModal = (entityKey) => (row = null) => {
    const config = CRUD_CONFIG[entityKey];
    const editRow = row && config?.fromRow ? config.fromRow(row) : row;
    setModal({ entityKey, editRow });
  };

  const closeModal = () => setModal({ entityKey: null, editRow: null });

  const renderTabContent = () => {
    const cfg = activeTabConfig?.entityKey ? activeTabConfig : null;
    if (cfg) {
      return (
        <motion.div key={activeTab} {...motionProps}>
          <EntityTab
            entityKey={cfg.entityKey}
            modalKey={cfg.modalKey}
            icon={cfg.icon}
            loadButtons={cfg.loadButtons}
            dispatch={dispatch}
            onEdit={openModal}
          />
        </motion.div>
      );
    }
    return (
      <motion.div key={activeTab} {...motionProps} className="p-8 text-center text-slate-500">
        wa ikana wlalayaal
      </motion.div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Classes</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage class and subject information</p>
      </div>

      {tabs.length > 0 && (
        <Card className="p-3 sm:p-4 overflow-hidden">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => dispatch(setActiveTab(id))} />
        </Card>
      )}

      <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>

      {modalEntities.map((entityKey) => {
        const config = CRUD_CONFIG[entityKey];
        const isOpen = modal.entityKey === entityKey;
        const editRow = modal.editRow;
        if (!config) return null;
        return (
          <CrudModal
            key={entityKey}
            isOpen={isOpen}
            onClose={closeModal}
            config={config}
            initialForm={editRow || {}}
            mode={editRow ? 'update' : 'insert'}
            onSuccess={() => {
              const q = getQueryForModalKey(tabs, entityKey);
              if (q) dispatch(loadData(q));
            }}
          />
        );
      })}
    </div>
  );
}
