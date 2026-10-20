const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

export const formatDate = (iso: string): string => dateFmt.format(new Date(iso))
