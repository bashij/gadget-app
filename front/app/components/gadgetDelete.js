import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import apiClient from '@/utils/apiClient'

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
      const response = await apiClient.delete(`${API_ENDPOINT}/${gadgetId}`, {
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
      props.setStatus('failure')
      if (error.response) {
        props.setMessage(error.response.errorMessage)
      } else if (error.request) {
        props.setMessage(error.request.errorMessage)
      } else {
        props.setMessage(error.errorMessage)
      }
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
