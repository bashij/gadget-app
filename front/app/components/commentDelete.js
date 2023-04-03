import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'

export default function CommentDelete(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS

  const handleClick = async (e, gadgetId, commentId) => {
    try {
      const confirmed = window.confirm('削除してよろしいですか？')
      if (!confirmed) {
        return
      }
      const response = await axios.delete(`${API_ENDPOINT}/${gadgetId}/comments/${commentId}`, {
        data: { id: commentId },
        withCredentials: true,
      })
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      props.setMessage(resMessage)
      props.setStatus(resStatus)
      props.mutate(props.swrKey)
    } catch (error) {
      console.log(error)
      console.log('catch error')
    }
  }

  return (
    <span className='tweet-icon'>
      <FontAwesomeIcon
        className='icon-delete'
        icon={faTrash}
        onClick={(event) => handleClick(event, props.gadget.id, props.comment.id)}
      />
    </span>
  )
}
