import { createRef, useCallback, useState } from 'react'
import { useModal } from '../../hooks/useModal'
import { ModalContext } from './ModalContext'
import { deepOverride } from '../../utils/deepOverride'

const MODAL_ROOT_ATTRIBUTES: React.HTMLAttributes<HTMLDivElement> = {
  style: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100dvw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const MODAL_BACKDROP_ATTRIBUTES: React.HTMLAttributes<HTMLDivElement> = deepOverride(
  {
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  },
  MODAL_ROOT_ATTRIBUTES
)

type Props = {
  children: React.ReactNode
  containerAttributes?: React.HTMLAttributes<HTMLDivElement>
  backdropAttributes?: React.HTMLAttributes<HTMLDivElement>
  beforeClose?: (ref?: React.RefObject<HTMLDivElement>) => Promise<void> | void
}

type Modal = {
  content: React.ReactNode
  ref: React.RefObject<HTMLDivElement>
  resolver: (value: unknown) => void
}

export function ModalProvider({
  children,
  containerAttributes = {},
  backdropAttributes = {},
  beforeClose,
}: Props) {
  containerAttributes = deepOverride(containerAttributes, MODAL_ROOT_ATTRIBUTES)
  backdropAttributes = deepOverride(backdropAttributes, MODAL_BACKDROP_ATTRIBUTES)

  const [modals, setModals] = useState<Modal[]>([])

  const openModal = useCallback(<T,>(content: React.ReactNode): Promise<T> => {
    return new Promise<T>((resolve) => {
      const newModal: Modal = {
        content,
        ref: createRef<HTMLDivElement>(),
        resolver: (value: unknown) => resolve(value as T),
      }
      setModals((prev) => [...prev, newModal])
    })
  }, [])

  const closeModal = useCallback(
    async (value: unknown) => {
      const top = modals[modals.length - 1]

      if (!top) return

      await beforeClose?.(top.ref)

      setModals((prev) => prev.slice(0, -1))
      top.resolver(value)
    },
    [beforeClose, modals]
  )

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ModalsRenderer modals={modals} {...{ containerAttributes, backdropAttributes }} />
    </ModalContext.Provider>
  )
}

type ModalsRendererProps = {
  modals: Modal[]
  containerAttributes: React.HTMLAttributes<HTMLDivElement>
  backdropAttributes: React.HTMLAttributes<HTMLDivElement>
}

function ModalsRenderer({ modals, containerAttributes, backdropAttributes }: ModalsRendererProps) {
  const { closeModal } = useModal()

  if (modals.length === 0) return null

  return (
    <>
      <div id="modals-container" {...containerAttributes}>
        {modals.map((modal, index) =>
          index === modals.length - 1 ? (
            <div
              ref={modal.ref}
              id="modal-backdrop"
              onClick={closeModal}
              {...backdropAttributes}
              key={index}
            >
              <div
                id="top-modal-wrapper"
                onClick={(e) => e.stopPropagation()}
                style={{ width: 'fit-content' }}
              >
                {modal.content}
              </div>
            </div>
          ) : (
            <div ref={modal.ref}>{modal.content}</div>
          )
        )}
      </div>
    </>
  )
}
