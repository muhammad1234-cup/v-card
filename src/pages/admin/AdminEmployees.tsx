import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Employee, CompanySettings } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { QRCodeModal } from '../../components/card/QRCodeModal';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  UserPlus,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  QrCode,
  CheckCircle,
  XCircle,
  Building,
  Mail,
  Phone,
} from 'lucide-react';

interface AdminEmployeesProps {
  onNavigate: (path: string) => void;
}

export const AdminEmployees: React.FC<AdminEmployeesProps> = ({ onNavigate }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);
  const [deleteCandidate, setDeleteCandidate] = useState<Employee | null>(null);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const [empList, compData] = await Promise.all([
        api.getEmployees(),
        api.getCompanySettings(),
      ]);
      setEmployees(empList);
      setCompany(compData);
    } catch {
      error('Failed to load employee list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department).filter(Boolean)))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.title.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleToggleStatus = async (emp: Employee) => {
    const newStatus = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updated = await api.updateEmployee(emp.id, { status: newStatus });
      setEmployees((prev) => prev.map((e) => (e.id === emp.id ? updated : e)));
      success(`${emp.name}'s card is now ${newStatus.toLowerCase()}`);
    } catch {
      error('Failed to update status');
    }
  };

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/card/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      success('Card URL copied to clipboard');
    } catch {
      // Fallback
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await api.deleteEmployee(deleteCandidate.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteCandidate.id));
      success(`Removed ${deleteCandidate.name}`);
      setDeleteCandidate(null);
    } catch {
      error('Failed to delete employee');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Employee Digital Cards</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your team's NFC business cards, public links, and access status.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => onNavigate('/admin/employees/new')}
        >
          Add New Employee
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search by name, email, title, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Role & Department</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Views / Downloads</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 text-sm">
                    No employees found matching your query.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`}
                          alt={emp.name}
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-100 truncate">{emp.name}</div>
                          <div className="text-xs text-zinc-400 flex items-center gap-2 truncate mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-zinc-500" />
                              {emp.email}
                            </span>
                            {emp.phone && (
                              <span className="hidden lg:flex items-center gap-1">
                                • <Phone className="w-3 h-3 text-zinc-500" /> {emp.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-zinc-200">{emp.title}</div>
                      <div className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-zinc-500" />
                        {emp.department}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(emp)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        {emp.status === 'ACTIVE' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-xs font-semibold text-zinc-200">
                        {emp.scanCount} scans
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {emp.vcardDownloadCount} saved vCards
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setQrEmployee(emp)}
                          title="Show QR Code"
                          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleCopyLink(emp.slug)}
                          title="Copy Card URL"
                          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onNavigate(`/card/${emp.slug}`)}
                          title="Open Public Card"
                          className="p-2 rounded-xl text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onNavigate(`/admin/employees/edit/${emp.id}`)}
                          title="Edit Employee"
                          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteCandidate(emp)}
                          title="Delete Employee"
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete Employee Card"
        message={`Are you sure you want to delete ${deleteCandidate?.name}'s digital card? This will deactivate their public card link and revoke their NFC card access.`}
        confirmText="Delete Card"
      />

      {/* QR Code Modal for Employee */}
      {qrEmployee && (
        <QRCodeModal
          isOpen={!!qrEmployee}
          onClose={() => setQrEmployee(null)}
          url={`${window.location.origin}/card/${qrEmployee.slug}`}
          employeeName={qrEmployee.name}
          companyName={company?.name}
          themeColor={qrEmployee.themeColor || company?.brandColor}
        />
      )}
    </div>
  );
};
