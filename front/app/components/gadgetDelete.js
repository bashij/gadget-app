import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'

export default function GadgetDelete(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS

  const handleClick = async (e, gadgetId) => {
    // statusを初期化
    props.setStatus()
    try {
      const confirmed = window.confirm('削除してよろしいですか？')
      if (!confirmed) {
        return
      }
      const response = await axios.delete(`${API_ENDPOINT}/${gadgetId}`, {
        data: { gadget_id: gadgetId },
        withCredentials: true,
      })
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resIsPageDeleted = await response.data.isPageDeleted
      props.setMessage(resMessage)
      props.setStatus(resStatus)
      props.setIsPageDeleted(resIsPageDeleted)
    } catch (error) {
      console.log(error)
      console.log('catch error')
    }
  }

  return (
    <div className='link-section'>
      <p className='icon-delete' onClick={(event) => handleClick(event, props.gadget.id)}>
        <FontAwesomeIcon icon={faTrash} />
        ガジェットとレビューを削除
      </p>
    </div>
  )
}
