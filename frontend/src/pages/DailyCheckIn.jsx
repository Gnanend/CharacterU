import React from 'react';
import CheckInForm from '../components/checkin/CheckInForm';

/**
 * Daily Check-In Page
 * Wraps the interactive check-in form.
 */
const DailyCheckIn = () => {
  return (
    <div className="pb-12">
      <CheckInForm />
    </div>
  );
};

export default DailyCheckIn;
