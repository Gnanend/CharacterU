import React from 'react';
import LeaderboardCard from './LeaderboardCard';

/**
 * LeaderboardTable Component
 * Renders the vertical list of users ranked 4th and below.
 */
const LeaderboardTable = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 bg-dark-900 border border-dark-800 rounded-2xl">
        No additional rankings available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user, index) => (
        // Adding 4 to the index because this table displays users starting at rank 4
        <LeaderboardCard key={user.id || index} rank={index + 4} user={user} />
      ))}
    </div>
  );
};

export default LeaderboardTable;
