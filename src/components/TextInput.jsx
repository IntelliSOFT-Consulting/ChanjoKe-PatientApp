export default function TextInput({
  leadingIcon,
  leadingIconName,
  inputType,
  inputName,
  inputId,
  inputValue,
  inputPlaceholder,
  trailingIcon,
  trailingIconName,
  onTrailingIconClick,
  onInputChange,
}) {

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        {
          leadingIcon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-[#707070]">
              { leadingIconName }
            </span>
          </div>
          ) : ''
        }
        <input
          type={inputType}
          name={inputName}
          id={inputId}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className={
            leadingIcon
            ? 'block w-full rounded-md border-0 py-4 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
            : 'block w-full rounded-md border-0 py-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
          }
          placeholder={inputPlaceholder}
        />
        {
          trailingIcon ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="material-symbols-outlined text-[#707070]" onClick={() => onTrailingIconClick()}>
              { trailingIconName }
            </span>
          </div>
          ) : ''
        }
      </div>
    </div>
  )
}