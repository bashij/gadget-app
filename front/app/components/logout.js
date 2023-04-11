import axios from 'axios'

export default function Logout(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_LOGOUT

  const handleClick = async (e) => {
    // statusを初期化
    props.setStatus()
    try {
      const confirmed = window.confirm('ログアウトしてよろしいですか？')
      if (!confirmed) {
        return
      }
      const response = await axios.delete(`${API_ENDPOINT}`, {
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
    <div className='nav-link' id='logout' onClick={(event) => handleClick(event)}>
      <span>LOGOUT</span>
    </div>
  )
}
