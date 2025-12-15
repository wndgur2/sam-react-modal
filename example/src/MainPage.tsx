import { GridBox, GridCell, useModal } from 'sam-react-modal'

function MainPage() {
  const { openModal, closeModal } = useModal()
  const onClick = async () => {
    console.log('onClick')
    const res = await openModal(
      <div style={{ backgroundColor: '#ffffff', padding: 320 }}>
        Hello!
        <button
          onClick={() => {
            closeModal('world')
          }}
        >
          return 'world'
        </button>
      </div>
    )
    console.log('modal returned ', res)
  }
  return (
    <GridBox columns="2fr 1fr" gap={10}>
      <GridCell column="1/3" style={{ backgroundColor: 'lightgrey' }}>
        Header
      </GridCell>
      <GridCell column="1/2" style={{ backgroundColor: 'lightgrey' }}>
        <div style={{ backgroundColor: 'skyblue' }}>hasdasello</div>
      </GridCell>
      <GridCell column="2/3" style={{ backgroundColor: 'lightgrey' }}>
        <button onClick={onClick}>Click me</button>
      </GridCell>
      <GridCell column="1/3" style={{ backgroundColor: 'lightgrey' }}>
        Footer
      </GridCell>
    </GridBox>
  )
}

export default MainPage
