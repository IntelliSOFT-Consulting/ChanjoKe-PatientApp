import moment from "moment";

export const getOffset = (page, pageSize = 12) => {
  return Math.abs(page <= 1 ? 0 : (page - 1) * pageSize)
}

export const writeAge = (age) => {
  let ageString = ''
  if (age.years > 0) {
    ageString += `${age.years} year${age.years > 1 ? 's' : ''} `
  }
  if (age.months > 0) {
    ageString += `${age.months} month${age.months > 1 ? 's' : ''} `
  }
  if (age.weeks > 0) {
    ageString += `${age.weeks} week${age.weeks > 1 ? 's' : ''} `
  }
  if (age.days > 0) {
    ageString += `${age.days} day${age.days > 1 ? 's' : ''} `
  }
  return ageString
}

export const calculateAges = (date) => {
  const now = moment()
  const dob = moment(date)
  const years = now.diff(dob, 'years')
  dob.add(years, 'years')
  const months = now.diff(dob, 'months')
  dob.add(months, 'months')
  const weeks = now.diff(dob, 'weeks')
  dob.add(weeks, 'weeks')
  const days = now.diff(dob, 'days')
  return { years, months, weeks, days }
}