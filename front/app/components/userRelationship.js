import axios from 'axios'
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
        response = await axios.delete(`${API_ENDPOINT}/${userId}`, {
          data: { user_id: userId },
          withCredentials: true,
        })
      } else {
        response = await axios.post(
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
      console.log(error)
      console.log('catch error')
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
