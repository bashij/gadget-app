import Image from 'next/image'

export default function UserFeed(props) {
  return (
    <>
      {props.data?.users.map((user) => {
        return (
          <div key={user.id} className='user-feed p-3 m-1'>
            <div className='user-info text-center me-2'>
              <Image
                src={
                  user.image.url == 'default.jpg'
                    ? '/images/default.jpg'
                    : `https://static.gadgetlink-app.com${user.image.url}`
                }
                width={150}
                height={150}
                alt='user-image'
              />
              <div className='user mt-2'>{user.name}</div>
            </div>
          </div>
        )
      })}
    </>
  )
}
