
export type Modal = {
  content: React.ReactNode
  ref: React.RefObject<HTMLDivElement>
  resolver: (value: unknown) => void
}