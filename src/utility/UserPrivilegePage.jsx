import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  CheckSquare2,
  Eraser,
  Minimize2,
  Maximize2,
  Save,
  XCircle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { defaultMenuItems } from '../config/menuConfig';
import Modal from '../components/ui/Modal';

// ----- Permission tree generation from menuConfig -----

function buildPermissionTree(items = defaultMenuItems) {
  return items
    .filter((m) => m.id !== 'dashboard')
    .map((module) => ({
      id: `module:${module.id}`,
      type: 'module',
      label: module.label,
      icon: module.icon,
      children: (module.children || []).map((menu) => ({
        id: `menu:${module.id}/${menu.id}`,
        type: 'menu',
        label: menu.label,
        children: (menu.tabs || []).map((tab) => ({
          id: `tab:${module.id}/${menu.id}/${tab.id}`,
          type: 'tab',
          label: tab.label,
          children: buildActionsFromTab(module, menu, tab),
        })),
      })),
    }))
    .filter((m) => m.children.length > 0);
}

function buildActionsFromTab(module, menu, tab) {
  const actions = (tab.loadButtons || []).map((btn) => ({
    id: `action:${module.id}/${menu.id}/${tab.id}/${btn.id}`,
    type: 'action',
    label: btn.label,
    children: [],
  }));

  if (!actions.length) {
    actions.push({
      id: `action:${module.id}/${menu.id}/${tab.id}/view`,
      type: 'action',
      label: 'View',
      children: [],
    });
  }
  return actions;
}

function flattenNodes(tree) {
  const all = [];
  const walk = (n) => {
    all.push(n);
    n.children?.forEach(walk);
  };
  tree.forEach(walk);
  return all;
}

function getNodeState(node, selectedIds) {
  if (!node.children || node.children.length === 0) {
    return selectedIds.has(node.id) ? 'checked' : 'unchecked';
  }
  const childStates = node.children.map((c) => getNodeState(c, selectedIds));
  const allChecked = childStates.every((s) => s === 'checked');
  const noneChecked = childStates.every((s) => s === 'unchecked');
  if (allChecked) return 'checked';
  if (noneChecked) return selectedIds.has(node.id) ? 'checked' : 'unchecked';
  return 'indeterminate';
}

function filterTree(tree, term) {
  const q = term.trim().toLowerCase();
  if (!q) return tree;
  const match = (label) => label.toLowerCase().includes(q);
  const walk = (node) => {
    const children = (node.children || []).map(walk).filter(Boolean);
    if (match(node.label) || children.length) return { ...node, children };
    return null;
  };
  return tree.map(walk).filter(Boolean);
}

// ----- Checkbox with indeterminate state -----

function IndeterminateCheckbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}

// ----- Row + Card components -----

function PermissionRow({ node, level, selectedIds, onToggleNode }) {
  const state = getNodeState(node, selectedIds);
  const checked = state === 'checked';
  const indeterminate = state === 'indeterminate';
  const paddingLeft = 12 + level * 18;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-0.5">
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
          checked
            ? 'bg-violet-50/80 text-violet-800 ring-1 ring-violet-200 translate-x-[1px]'
            : 'hover:bg-slate-50 text-slate-700'
        }`}
        style={{ paddingLeft }}
      >
        <IndeterminateCheckbox
          checked={checked}
          indeterminate={indeterminate}
          onChange={(c) => onToggleNode(node, c)}
        />
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && (
        <div className="space-y-1">
          {node.children.map((child) => (
            <PermissionRow
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              onToggleNode={onToggleNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PermissionCard({ node, expanded, onToggleExpand, selectedIds, onToggleNode }) {
  const state = getNodeState(node, selectedIds);
  const checked = state === 'checked';
  const indeterminate = state === 'indeterminate';
  const Icon = node.icon;

  return (
    <Card className="p-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-[0_18px_45px_-25px_rgba(15,23,42,0.45)] flex flex-col">
      <button
        type="button"
        onClick={onToggleExpand}
        className="relative flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-50/40 border-b border-slate-100"
      >
        <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400" />
        <div className="flex items-center gap-3">
          <IndeterminateCheckbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={(c) => onToggleNode(node, c)}
          />
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            {Icon && (
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm">
                <Icon className="w-4 h-4" />
              </span>
            )}
            <div className="flex flex-col items-start">
              <span>{node.label}</span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Module
              </span>
            </div>
          </div>
        </div>
        <span className="text-slate-400">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
      </button>
      {expanded && (
        <div className="p-3 space-y-2">
          {node.children.map((menu) => (
            <PermissionRow
              key={menu.id}
              node={menu}
              level={1}
              selectedIds={selectedIds}
              onToggleNode={onToggleNode}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

// ----- Main page -----

export default function UserPrivilegePage() {
  const tree = useMemo(() => buildPermissionTree(defaultMenuItems), []);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(() => new Set(tree.map((m) => m.id)));
  const [selectedIds, setSelectedIds] = useState(() => new Set(flattenNodes(tree).map((n) => n.id)));
  const [isOpen, setIsOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(tree[0]?.id || '');

  const filteredTree = useMemo(() => filterTree(tree, search), [tree, search]);

  const handleToggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleNode = (node, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const stack = [node];
      while (stack.length) {
        const cur = stack.pop();
        if (!cur) continue;
        if (checked) next.add(cur.id);
        else next.delete(cur.id);
        cur.children?.forEach((c) => stack.push(c));
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(flattenNodes(tree).map((n) => n.id)));
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const handleCollapseAll = () => setExpanded(new Set());
  const handleExpandAll = () => setExpanded(new Set(tree.map((m) => m.id)));

  const handleSave = () => {
    // Halkan ayaad backend ugu diri kartaa selectedIds
    // console.log(Array.from(selectedIds));
  };

  return (
    <div className="space-y-4">
      {/* Page header with open-modal button */}
      <Card className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80 shadow-sm">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">
            User Privilege Management
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Configure module, menu, tab and action permissions generated from your system menu.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<CheckSquare2 className="w-4 h-4" />}
          onClick={() => setIsOpen(true)}
        >
          Manage Privileges
        </Button>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="User Privilege Management"
        size="xl"
        className="max-w-5xl"
        bodyClassName="space-y-4 bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-100 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950"
        footer={
          <>
            <Button
              variant="ghost"
              leftIcon={<XCircle className="w-4 h-4" />}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        }
      >
        {/* Toolbar inside modal */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search permission..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<CheckSquare2 className="w-4 h-4" />}
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Eraser className="w-4 h-4" />}
              onClick={handleClearAll}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Minimize2 className="w-4 h-4" />}
              onClick={handleCollapseAll}
            >
              Collapse All
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Maximize2 className="w-4 h-4" />}
              onClick={handleExpandAll}
            >
              Expand All
            </Button>
          </div>
        </div>

        {/* Module tabs row */}
        <div className="mt-4 flex flex-wrap items-center justify-start gap-2 border-b border-slate-200 pb-3">
          {filteredTree.map((module) => {
            const Icon = module.icon;
            const isActive = module.id === activeModuleId;
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setActiveModuleId(module.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="truncate">{module.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content for active module */}
        <div className="mt-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-700 shadow-sm px-4 py-5">
          {(() => {
            const activeModule =
              filteredTree.find((m) => m.id === activeModuleId) ||
              filteredTree[0] ||
              null;
            if (!activeModule) {
              return (
                <p className="text-sm text-slate-500">
                  No permissions available for this selection.
                </p>
              );
            }
            return (
              <div className="flex flex-wrap gap-6">
                {activeModule.children.map((menu) => (
                  <div key={menu.id} className="min-w-[210px] space-y-2">
                    <div className="text-sm font-semibold text-sky-700 border-b border-sky-100 pb-1">
                      {menu.label}
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {menu.children.map((tab) => {
                        const tabState = getNodeState(tab, selectedIds);
                        const tabChecked = tabState === 'checked';
                        const tabIndeterminate = tabState === 'indeterminate';
                        return (
                          <div key={tab.id} className="space-y-0.5">
                            <div className="flex items-center gap-2 text-sm text-slate-800">
                              <IndeterminateCheckbox
                                checked={tabChecked}
                                indeterminate={tabIndeterminate}
                                onChange={(c) => handleToggleNode(tab, c)}
                              />
                              <span className="font-medium">{tab.label}</span>
                            </div>
                            {tab.children?.length > 0 && (
                              <div className="pl-6 space-y-0.5">
                                {tab.children.map((action) => {
                                  const actionState = getNodeState(
                                    action,
                                    selectedIds,
                                  );
                                  const actionChecked =
                                    actionState === 'checked';
                                  return (
                                    <button
                                      key={action.id}
                                      type="button"
                                      onClick={() =>
                                        handleToggleNode(action, !actionChecked)
                                      }
                                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                                        actionChecked
                                          ? 'bg-violet-50 text-violet-700 border-violet-400'
                                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      <span>{action.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
}

