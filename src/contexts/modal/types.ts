
export type Modal = {
  id: string
  content: React.ReactNode
  ref: React.RefObject<HTMLDivElement>
  resolver: (value: unknown) => void
}