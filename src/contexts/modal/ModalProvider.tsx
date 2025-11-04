import { createRef, useCallback, useState } from 'react'
import { useModal } from '../../hooks/useModal'
import { ModalContext } from './ModalContext'
import { deepOverride } from '../../utils/deepOverride'
import { Modal } from './types'

type Props = {
  children: React.ReactNode
  containerAttributes?: React.HTMLAttributes<HTMLDivElement>
  backdropAttributes?: React.HTMLAttributes<HTMLDivElement>
  modalWrapperAttributes?: React.HTMLAttributes<HTMLDivElement>
  beforeClose?: (ref?: React.RefObject<HTMLDivElement>) => Promise<void>
}

export function ModalProvider({
  children,
  containerAttributes = {},
  backdropAttributes = {},
  modalWrapperAttributes = {},
  beforeClose,
}: Props) {
  containerAttributes = deepOverride(containerAttributes, MODAL_ROOT_ATTRIBUTES)
  backdropAttributes = deepOverride(backdropAttributes, MODAL_BACKDROP_ATTRIBUTES)
  modalWrapperAttributes = deepOverride(modalWrapperAttributes, MODAL_WRAPPER_ATTRIBUTES)

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
    async (value?: unknown) => {
      setModals((modals) => {
        const top = modals[modals.length - 1]
        if (!top) return modals

        if (beforeClose) {
          beforeClose(top.ref).then(() => {
            const newModals = modals.slice(0, -1)
            top.resolver(value)

            setModals(newModals)
          })
          return modals
        } else {
          const newModals = modals.slice(0, -1)
          top.resolver(value)

          return newModals
        }
      })
    },
    [beforeClose]
  )

  const closeAllModals = useCallback(() => {
    setModals([])
  }, [])

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modals, closeAllModals }}>
      {children}
      <ModalsRenderer
        modals={modals}
        {...{ containerAttributes, backdropAttributes, modalWrapperAttributes }}
      />
    </ModalContext.Provider>
  )
}

type ModalsRendererProps = {
  modals: Modal[]
  containerAttributes: React.HTMLAttributes<HTMLDivElement>
  backdropAttributes: React.HTMLAttributes<HTMLDivElement>
  modalWrapperAttributes?: React.HTMLAttributes<HTMLDivElement>
}

function ModalsRenderer({
  modals,
  containerAttributes,
  backdropAttributes,
  modalWrapperAttributes,
}: ModalsRendererProps) {
  const { closeModal } = useModal()

  if (modals.length === 0) return null

  return (
    <>
      <div id="modals-container" {...containerAttributes}>
        <div id="modal-backdrop" onClick={() => closeModal()} {...backdropAttributes}></div>
        {modals.map((modal, index) => (
          <div
            key={index}
            ref={modal.ref}
            onClick={(e) => e.stopPropagation()}
            {...modalWrapperAttributes}
            style={{
              position: 'fixed',
              zIndex: index === modals.length - 1 ? 1001 : 999,
              ...modalWrapperAttributes?.style,
            }}
          >
            {modal.content}
          </div>
        ))}
      </div>
    </>
  )
}

/* ---기본 속성들--- */

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
    zIndex: 1000,
  },
}

const MODAL_BACKDROP_ATTRIBUTES: React.HTMLAttributes<HTMLDivElement> = {
  style: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 1000,

    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
}

const MODAL_WRAPPER_ATTRIBUTES: React.HTMLAttributes<HTMLDivElement> = {
  style: {
    position: 'fixed',
  },
}
