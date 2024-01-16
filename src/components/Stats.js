const stats = [
  { name: 'Vaccines', icon: 'vaccines', key: 'vaccines' },
  { name: 'Appointments', icon: 'event_note', key: 'appointments' },
  { name: 'Certificates', icon: 'description', key: 'certificates' },
]

export default function Stats(props) {
  return (
    <div className="mt-10">
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 text-[#163C94]">
            <dt className="truncate text-2xl">{item.name}</dt>
            <div className="grid grid-cols-4">
              <div className="material-symbols-outlined mt-2 col-span-3 text-5xl">{item.icon}</div>
              <dd className="mt-1 text-5xl tracking-tight">{props[item.key]}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}