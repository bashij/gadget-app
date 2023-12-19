import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import apiClient from '@/utils/apiClient'

export default function CommentDelete(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS

  const handleClick = async (e, gadgetId, commentId) => {
    try {
      const confirmed = window.confirm('削除してよろしいですか？')
      if (!confirmed) {
        return
      }
      const response = await apiClient.delete(`${API_ENDPOINT}/${gadgetId}/comments/${commentId}`, {
        data: { id: commentId },
        withCredentials: true,
      })
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      props.setMessage(resMessage)
      props.setStatus(resStatus)
      props.mutate(props.swrKey)
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
    <span className='tweet-icon'>
      <FontAwesomeIcon
        className='icon-delete'
        icon={faTrash}
        onClick={(event) => handleClick(event, props.gadget.id, props.comment.id)}
        data-testid={`comment_delete_icon_${props.comment.id}`}
      />
    </span>
  )
}
