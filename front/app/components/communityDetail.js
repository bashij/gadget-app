import Image from 'next/image'
import Link from 'next/link'

import { format } from 'date-fns'

export default function CommunityDetail(props) {
  return (
    <table className='table table-sm community-table-detail'>
      <tbody>
        <tr>
          <th>コミュニティ名</th>
          <td>
            <p className='overflow'>{props.community.name}</p>
          </td>
        </tr>
        <tr>
          <th>参加人数</th>
          <td>
            <p className='overflow'>
              <span id={`membership_count_${props.community.id}`}>{props.membershipCount} 人</span>
            </p>
          </td>
        </tr>
        <tr>
          <th>作成者</th>
          <td>
            <p className='overflow'>
              <Image
                src={
                  props.community.user.image.url === 'default.jpg'
                    ? '/images/default.jpg'
                    : props.community.user.image.url
                }
                width={50}
                height={50}
                alt='user-image'
              />
              <Link href={`/users/${props.community.user.id}`}>{props.community.user.name}</Link>
            </p>
          </td>
        </tr>
        <tr>
          <th>作成日時</th>
          <td>
            <p className='overflow' suppressHydrationWarning>
              {format(new Date(props.community.created_at), 'yyyy/MM/dd HH:mm')}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
