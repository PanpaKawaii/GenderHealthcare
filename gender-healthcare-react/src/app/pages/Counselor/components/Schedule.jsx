import React from 'react';
import { DatePicker } from 'antd';

export default function Schedule() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Schedule</h1>
      <DatePicker />
    </div>
  );
}
