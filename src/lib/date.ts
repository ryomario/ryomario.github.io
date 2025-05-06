export function date2string(date?: Date|number|string, showTime = true) {
  if(!date) date = Date.now()
  if(!(date instanceof Date)) date = new Date(date)
  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const date_of_month = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${
    [year,month,date_of_month].map(n => String(n).padStart(2,'0')).join('-')
  } ${
    showTime ? [hour,minute,second].map(n => String(n).padStart(2,'0')).join(':') : ''
  }`.trim()
}