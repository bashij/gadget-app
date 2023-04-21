import apiClient from '@/utils/apiClient'
import { useState } from 'react'

export default function UserRelationship(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_RELATIONSHIPS

  const [isFollowing, setIsFollowing] = useState(
    props.pageUser.followers.some((follower) => follower.id === props.currentUser?.id),
  )

  const handleClick = async (e, userId) => {
    try {
      let response
      if (isFollowing) {
        response = await apiClient.delete(`${API_ENDPOINT}/${userId}`, {
          data: { user_id: userId },
          withCredentials: true,
        })
      } else {
        response = await apiClient.post(
          `${API_ENDPOINT}`,
          {
            followed_id: userId,
          },
          { withCredentials: true },
        )
      }
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resFollowing = await response.data.following
      const resCount = await response.data.count
      props.setMessage(resMessage)
      props.setStatus(resStatus)
      setIsFollowing(resFollowing)
      props.setFollowerCount(resCount)
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
    <>
      <div className='text-center m-4'>
        <p>
          <span
            className={`btn ${isFollowing ? 'btn-destroy' : 'btn-create'}`}
            onClick={(event) => handleClick(event, props.pageUser.id)}
          >
            {isFollowing ? 'フォロー解除' : 'フォローする'}
          </span>
        </p>
      </div>
    </>
  )
}
