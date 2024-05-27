import { AppointmentsIcon } from "../assets/icons/AppointmentsIcon"
import { VaccineIcon } from "../assets/icons/VaccineIcon"
import { CertificateIcon } from "../assets/icons/CertificateIcon"

const stats = [
  { name: 'Vaccines Administered', icon: VaccineIcon, key: 'vaccines' },
  { name: 'Appointments', icon: AppointmentsIcon, key: 'appointments' },
  { name: 'Certificates', icon: CertificateIcon, key: 'certificates' },
]

export default function Stats(props) {
  return (
    <div className="mt-10">
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 text-[#163C94]">
              <dt className="truncate text-2xl">{item.name}</dt>
              <div className="grid grid-cols-4">
                <div className="material-symbols-outlined mt-2 col-span-3 text-5xl">
                  <IconComponent fillColor="#163C94" height="40px" width="40px" />
                </div>
                <dd className="mt-1 text-5xl tracking-tight">{props[item.key]}</dd>
              </div>
            </div>
          )
        })}
      </dl>
    </div>
  )
}