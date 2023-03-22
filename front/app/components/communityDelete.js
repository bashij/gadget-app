import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'

export default function CommunityDelete(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES

  const handleClick = async (e, communityId) => {
    // statusを初期化
    props.setStatus()
    try {
      const confirmed = window.confirm('削除してよろしいですか？')
      if (!confirmed) {
        return
      }
      const response = await axios.delete(`${API_ENDPOINT}/${communityId}`, {
        data: { community_id: communityId },
        withCredentials: true,
      })
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      props.setMessage(resMessage)
      props.setStatus(resStatus)
    } catch (error) {
      console.log(error)
      console.log('catch error')
    }
  }

  return (
    <div className='link-section'>
      <p className='icon-delete' onClick={(event) => handleClick(event, props.community.id)}>
        <FontAwesomeIcon icon={faTrash} />
        コミュニティを削除
      </p>
    </div>
  )
}
