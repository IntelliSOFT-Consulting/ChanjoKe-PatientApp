export default function Table(props) {

  const handleDownload = () => {}

  return (
    <div className="border-b border-gray-200 rounded-lg shadow bg-white px-4 py-5 sm:px-6">
      {props.tableTitle && <div className="sm:flex sm:items-center">
        <h1 className="font-semibold text-1xl">
          {props.tableTitle}
        </h1>
      </div>}
      <div className="mt-8 flow-root mb-10">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr className="divide-x divide-gray-200">
                    {props.theaders.map((header) => (
                      <th scope="col" className={header.classes}>
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {props.data?.map((item, index) => (
                  <tr className="divide-x divide-gray-200" key={index}>
                    {Object.keys(item).map((itemkey) => (
                      <td
                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm ${
                          props.theaders.find((header) => header?.title === itemkey)?.classes || ''
                        }`}
                        key={itemkey}
                      >
                        {itemkey === 'action' ? (
                          <button className="text-blue-500" onClick={() => handleDownload(item['number'])}>
                            Download
                          </button>
                        ) : (
                          item[itemkey]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
