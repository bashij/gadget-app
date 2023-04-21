import apiClient from '@/utils/apiClient'
import { useState } from 'react'

export default function TweetForm(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS

  const [formData, setFormData] = useState({
    content: '',
    parent_id: props.tweet?.id,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiClient.post(
        API_ENDPOINT,
        { tweet: formData },
        { withCredentials: true },
      )
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      props.setMessage(resMessage)
      props.setStatus(resStatus)
      props.mutate(props.swrKey)
      if (props.tweet?.id) {
        props.setReplyFormId(props.tweet?.id)
      }
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
    <div className={`${props.tweet?.id ? 'reply-form' : ''}`}>
      <form
        onSubmit={handleSubmit}
        id={`${props.tweet?.id ? `reply_form_${props.tweet?.id}` : 'tweet_form'}`}
      >
        <div className='mb-3'>
          <textarea
            type='text'
            className='form-control'
            name='content'
            onChange={handleChange}
            required
            placeholder={props.placeholder}
          />
        </div>
        <div className='text-center m-4'>
          <p>
            <input type='submit' name='commit' value='投稿する' className='btn btn-create' />
          </p>
        </div>
      </form>
    </div>
  )
}
