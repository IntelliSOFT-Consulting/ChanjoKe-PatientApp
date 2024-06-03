import React, { useEffect, useState } from 'react'
import RoutineSchedule from './schedule/RoutineSchedule'
import NonRoutineSchedule from './schedule/NonRoutineSchedule'

const tabs = [
  { name: 'Routine Vaccines', id: 'routineScheduleTab', current: false },
  { name: 'Non Routine Vaccines', id: 'nonRoutineSchedule', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BaseTabs({ data, columns }) {
  const [currentTab, setCurrentTab] = useState('routineScheduleTab')
  const [routineSchedules, setRoutineSchedules] = useState([])
  const [nonRoutineSchedules, setNonRoutineSchedules] = useState([])

  useEffect(() => {
    const routineSchedules = data.filter((vaccine) => vaccine.description === 'routine')
    const nonRoutineSchedules = data.filter((vaccine) => vaccine.description !== 'routine')

    setRoutineSchedules(routineSchedules)
    setNonRoutineSchedules(nonRoutineSchedules)
  }, [])

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId)
  }

  return (
    <div>
       <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only"></label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                className={classNames(
                  currentTab === tab.id
                    ? 'bg-[#163C94] text-white'
                    : 'text-gray-800 hover:border-gray-300 hover:text-gray-700',
                  'w-1/3 border-b py-4 px-4 text-center text-sm font-medium'
                )}
                onClick={() => handleTabChange(tab.id)}
                aria-current={currentTab === tab.id ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {currentTab === 'routineScheduleTab' && routineSchedules.length > 1 &&  (
        <RoutineSchedule schedule={routineSchedules} columns={columns} />
      )}
      {currentTab === 'nonRoutineSchedule' && nonRoutineSchedules.length > 1 && (
        <NonRoutineSchedule schedule={nonRoutineSchedules} columns={columns} />
      )} 
    </div>
  )
}
