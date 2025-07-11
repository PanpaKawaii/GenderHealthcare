import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DashboardHeader } from "../../../components/ForumComponents/ui/dashboard-header.tsx";
import { DashboardShell } from "../../../components/ForumComponents/ui/dashboard-shell.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ForumComponents/ui/tabs";
import { Button } from "../../../components/ForumComponents/ui/button";
import { CalendarPlus } from "lucide-react";

import OverviewSchedule from "../../Counselor/components/Schedule/OverviewSchedule.jsx";
import TodayBookings from "../../Counselor/components/Schedule/TodayBookings.jsx";
import HistoryBookings from "../../Counselor/components/Schedule/HistoryBookings.jsx";

export default function Schedule() {
  const [searchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState('overview');

  // Sync tab from query param on component mount
  useEffect(() => {
    if (tabQuery === 'overview' || tabQuery === 'today' || tabQuery === 'history') {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  return (
    <DashboardShell>
      <DashboardHeader heading="Schedule" text="Manage your consultation schedules">
      </DashboardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Work Schedule</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSchedule />
        </TabsContent>

        <TabsContent value="today">
          <TodayBookings />
        </TabsContent>

        <TabsContent value="history">
          <HistoryBookings />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
