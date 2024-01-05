import { KeyboardEvent } from 'react'

const isEnterKey = (e: KeyboardEvent) => e.key === 'Enter' || e.keyCode === 13

export default { isEnterKey }
