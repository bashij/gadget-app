import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

export default function TweetForm(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS

  const [formData, setFormData] = useState({
    content: '',
    parent_id: props.parentId,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        API_ENDPOINT,
        { tweet: formData },
        { withCredentials: true },
      )
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resTweet = await response.data.tweet
      const resUpdatedReplyCount = await response.data.replyCount
      props.setMessage(resMessage)
      props.setStatus(resStatus)
      props.setNewTweet(resTweet)
      props.setUpdatedReplyCount(resUpdatedReplyCount)
    } catch (error) {
      console.log(error)
      console.log('catch error')
    }
  }

  return (
    <div className={`${props.parentId ? 'reply-form' : ''}`}>
      <form
        onSubmit={handleSubmit}
        id={`${props.parentId ? `reply_form_${props.parentId}` : 'tweet_form'}`}
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
