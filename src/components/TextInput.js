export default function TextInput(props) {
  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        {
          props.leadingIcon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-[#707070]">
              { props.leadingIconName }
            </span>
          </div>
          ) : ''
        }
        <input
          type={props.inputType}
          name={props.inputName}
          id={props.inputId}
          className={
            props.leadingIcon
            ? 'block w-full rounded-md border-0 py-4 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
            : 'block w-full rounded-md border-0 py-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
          }
          placeholder={props.inputPlaceholder}
        />
      </div>
    </div>
  )
}