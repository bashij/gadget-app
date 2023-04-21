import apiClient from '@/utils/apiClient'

export default function UserDelete(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS

  const handleClick = async (e, userId) => {
    // statusを初期化
    props.setStatus()
    try {
      const confirmed = window.confirm('削除してよろしいですか？')
      if (!confirmed) {
        return
      }
      const response = await apiClient.delete(`${API_ENDPOINT}/${userId}`, {
        data: { user_id: userId },
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
    <div className='text-center m-4'>
      <p>
        <input
          type='submit'
          name='commit'
          value='退会する'
          className='btn btn-destroy'
          onClick={(event) => handleClick(event, props.user.id)}
        />
      </p>
    </div>
  )
}
