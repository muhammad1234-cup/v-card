import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { AnalyticsStats, Employee, CompanySettings } from '../../types';
import { Button } from '../../components/common/Button';
import { 
  Users, 
  CreditCard, 
  Eye, 
  Download, 
  UserPlus, 
  Settings, 
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, empData, compData] = await Promise.all([
          api.getAdminStats(),
          api.getEmployees(),
          api.getCompanySettings(),
        ]);
        setStats(statsData);
        setEmployees(empData);
        setCompany(compData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees ?? employees.length,
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      description: 'Registered team members',
    },
    {
      title: 'Active NFC Cards',
      value: stats?.activeCards ?? employees.filter((e) => e.status === 'ACTIVE').length,
      icon: CreditCard,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Live physical & digital cards',
    },
    {
      title: 'Total Card Views',
      value: stats?.totalScans ?? employees.reduce((acc, e) => acc + e.scanCount, 0),
      icon: Eye,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Via QR codes & NFC taps',
    },
    {
      title: 'vCard Downloads',
      value: stats?.totalDownloads ?? employees.reduce((acc, e) => acc + e.vcardDownloadCount, 0),
      icon: Download,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Saved directly to phone contacts',
    },
  ];

  const topEmployees = [...employees]
    .sort((a, b) => b.scanCount + b.vcardDownloadCount - (a.scanCount + a.vcardDownloadCount))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Admin Center</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {company?.name || 'Company'} Digital Card Fleet
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor real-time card taps, QR engagements, and employee contact sharing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Settings className="w-4 h-4" />}
            onClick={() => onNavigate('/admin/company')}
          >
            Brand Settings
          </Button>
          <Button
            variant="primary"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => onNavigate('/admin/employees/new')}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400">{c.title}</span>
                <div className={`p-2 rounded-xl border ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-zinc-100">{c.value}</div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{c.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Top Cards & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Digital Cards */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Top Performing Cards</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Most engaged team digital profiles</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('/admin/employees')}
            >
              View All ({employees.length})
            </Button>
          </div>

          <div className="space-y-3">
            {topEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-800/80 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`}
                    alt={emp.name}
                    className="w-11 h-11 rounded-xl object-cover bg-zinc-700 shrink-0"
                  />
                  <div className="truncate">
                    <div className="text-sm font-semibold text-zinc-100 truncate flex items-center gap-2">
                      {emp.name}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300 font-normal">
                        {emp.department}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 truncate mt-0.5">{emp.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-zinc-200">
                      {emp.scanCount} views
                    </div>
                    <div className="text-[11px] text-emerald-400">
                      {emp.vcardDownloadCount} saved contacts
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ExternalLink className="w-3.5 h-3.5 text-blue-400" />}
                    onClick={() => onNavigate(`/card/${emp.slug}`)}
                  >
                    View Card
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Scan Activity Stream */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">Recent Card Taps</h2>
            <p className="text-xs text-zinc-400 mb-6">Live NFC & QR scan interactions</p>

            <div className="space-y-4">
              {stats?.recentScans && stats.recentScans.length > 0 ? (
                stats.recentScans.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-ping" />
                    <div>
                      <div className="font-medium text-zinc-200">
                        {scan.employeeName}
                        <span className="text-zinc-500 font-normal"> ({scan.department})</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{scan.timestamp}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No recent scan events recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-800 bg-zinc-800/30 p-4 rounded-2xl">
            <div className="text-xs font-semibold text-zinc-200">NFC Card Fleet Tip</div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Program physical NFC tags directly in the Employee Portal via Web NFC on any modern phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
