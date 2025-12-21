import { FlexBox, useModal } from 'sam-react-modal'

function MainPage() {
  const { openModal, closeModal } = useModal()

  const showConfirm = async () => {
    const choice = await openModal<string>(
      <FlexBox direction="column" style={{ padding: 24, backgroundColor: '#fff' }}>
        <h2>Delete file?</h2>
        <FlexBox gap={12}>
          <button onClick={() => closeModal('cancel')}>Cancel</button>
          <button onClick={() => closeModal('confirm')}>Delete</button>
        </FlexBox>
      </FlexBox>
    )

    console.log(choice)

    if (choice === 'confirm') {
      alert('File deleted')
    }
  }

  return <button onClick={showConfirm}>Delete</button>
}

export default MainPage
