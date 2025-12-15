import { ModalProvider } from 'sam-react-modal'
import MainPage from './MainPage'

function App() {
  return (
    <ModalProvider
      backdropAttributes={{
        className: 'fadeIn',
      }}
      beforeClose={async (ref) => {
        if (!ref?.current) return
        ref.current.classList.remove('fadeIn')
        ref.current.classList.add('fadeOut')
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 300)
        })
      }}
    >
      <MainPage />
    </ModalProvider>
  )
}

export default App
