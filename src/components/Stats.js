const stats = [
  { name: 'Vaccines', stat: '5', icon: 'vaccines' },
  { name: 'Appointments', stat: '10', icon: 'event_note' },
  { name: 'Certificates', stat: '4', icon: 'description' },
]

export default function Stats() {
  return (
    <div className="mt-10">
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 text-[#163C94]">
            <dt className="truncate text-2xl">{item.name}</dt>
            <div className="grid grid-cols-4">
              <div className="material-symbols-outlined mt-2 col-span-3 text-5xl">{item.icon}</div>
              <dd className="mt-1 text-5xl tracking-tight">{item.stat}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}