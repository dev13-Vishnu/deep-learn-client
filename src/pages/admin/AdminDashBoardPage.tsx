import { useState } from 'react';
import InstructorApplicationsTab from './components/InstructorApplicationsTab';
import UsersTab from './components/UsersTab';
import StatsTab from './components/StatsTab';

type Tab = 'applications' | 'users' | 'stats';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('applications');

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'applications'
                ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Instructor Applications
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'users'
                ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'stats'
                ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Statistics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'applications' && <InstructorApplicationsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'stats' && <StatsTab />}
    </div>
  );
}