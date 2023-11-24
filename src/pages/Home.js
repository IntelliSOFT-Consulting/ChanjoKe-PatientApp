import { Link } from "react-router-dom";
import Stats from '../components/Stats';
import Table from '../components/Table';

const appointments = [
  { date: 'Tue, March 30, 2023', vaccine: 'Oxford/AstraZeneca' },
]

const tableHeaders = [
  { title: 'Date', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

function Home() {
  return (
    <div>
      <Stats />

      <br />

      <Table
        tableTitle="Upcoming appointments"
        theaders={tableHeaders}
        data={appointments} />
    </div>
  );
}

export default Home;