const mediumTime = new Intl.DateTimeFormat('zh-CN', {
  hour12: false,
  timeStyle: 'short'
})

const fullTime = new Intl.DateTimeFormat('zh-CN', {
  hour12: false,
  timeStyle: 'short',
  dateStyle: 'short'
})

const dateToString = (date: Date | string) => {
  if (typeof date === 'undefined' || !date) { return '' }
  const noteDate = new Date(date)
  if (noteDate.getTime() <= 0) { return '' }
  const today = new Date()
  if (noteDate.toDateString() === today.toDateString()) {
    return 'Today ' + (mediumTime.format(noteDate))
  } else {
    return fullTime.format(noteDate)
  }
}

export {
  dateToString
}
