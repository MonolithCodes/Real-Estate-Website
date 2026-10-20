import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { PlusIcon } from './icons'

export interface AccordionItem {
  id: string
  question: string
  answer: ReactNode
}

interface AccordionProps {
  items: readonly AccordionItem[]
  defaultOpenId?: string
}

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null)
  const base = useId()

  return (
    <div className="accordion">
      {items.map((item) => {
        const open = openId === item.id
        const panelId = `${base}-${item.id}-panel`
        const triggerId = `${base}-${item.id}-trigger`
        return (
          <div className="accordion__item" data-open={open} key={item.id}>
            <h3>
              <button
                type="button"
                id={triggerId}
                className="accordion__trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                {item.question}
                <PlusIcon className="accordion__icon" size={22} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="accordion__panel"
              inert={!open}
            >
              <div className="accordion__panel-inner">
                <div className="accordion__body">{item.answer}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
