import axios from 'axios'

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
      const response = await axios.delete(`${API_ENDPOINT}/${userId}`, {
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
      console.log(error)
      console.log('catch error')
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
