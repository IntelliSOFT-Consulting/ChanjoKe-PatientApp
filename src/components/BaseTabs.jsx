import React, { useEffect, useState } from "react";
import RoutineSchedule from "./schedule/RoutineSchedule";
import NonRoutineSchedule from "./schedule/NonRoutineSchedule";

const tabs = [
  { name: "Routine Vaccines", id: "routineScheduleTab" },
  { name: "Non Routine Vaccines", id: "nonRoutineSchedule" },
];

function BaseTabs({ data, columns }) {
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const [schedules, setSchedules] = useState({ routine: [], nonRoutine: [] });

  useEffect(() => {
    const routine = data.filter((vaccine) => vaccine.description === "routine");
    const nonRoutine = data.filter((vaccine) => vaccine.description !== "routine");
    setSchedules({ routine, nonRoutine });
  }, [data]);

  const handleTabChange = (tabId) => setCurrentTab(tabId);

  const renderTabContent = () => {
    if (currentTab === "routineScheduleTab" && schedules.routine.length > 1) {
      return <RoutineSchedule schedule={schedules.routine} columns={columns} />;
    }
    if (currentTab === "nonRoutineSchedule" && schedules.nonRoutine.length > 1) {
      return <NonRoutineSchedule schedule={schedules.nonRoutine} columns={columns} />;
    }
    return null;
  };

  return (
    <div>
      <div className='sm:hidden'>
        <label htmlFor='tabs' className='sr-only'>
          Select tab
        </label>
        <select
          id='tabs'
          name='tabs'
          className='block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          value={currentTab}
          onChange={(e) => handleTabChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block'>
        <nav className='border-b border-gray-200 -mb-px flex cursor-pointer' aria-label='Tabs'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-1/2 border-b py-4 px-4 text-center text-sm font-medium ${
                currentTab === tab.id ? "bg-[#163C94] text-white" : "text-gray-800 hover:border-gray-300 hover:text-gray-700"
              }`}
              aria-current={currentTab === tab.id ? "page" : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      {renderTabContent()}
    </div>
  );
}

export default BaseTabs;
