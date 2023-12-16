import Image from 'next/image'
import Link from 'next/link'

import { format } from 'date-fns'

export default function GadgetDetail(props) {
  return (
    <table className='table table-sm'>
      <tbody>
        <tr>
          <th>
            <span className='gadget-info-header'>ガジェット名</span>
          </th>
          <td>
            <p className='overflow'>
              <Link href={`/gadgets/${props.gadget.id}`}>{props.gadget.name}</Link>
            </p>
          </td>
        </tr>
        <tr>
          <th>
            <span className='gadget-info-header'>カテゴリ</span>
          </th>
          <td>
            <p className='overflow'>{props.gadget.category}</p>
          </td>
        </tr>
        <tr>
          <th>
            <span className='gadget-info-header'>型番</span>
          </th>
          <td>
            <p className='overflow'>{props.gadget.model_number || '-'}</p>
          </td>
        </tr>
        <tr>
          <th>
            <span className='gadget-info-header'>メーカー</span>
          </th>
          <td>
            <p className='overflow'>{props.gadget.manufacturer || '-'}</p>
          </td>
        </tr>
        <tr>
          <th>
            <span className='gadget-info-header'>価格</span>
          </th>
          <td>
            <p className='overflow'>
              {props.gadget.price ? `¥${props.gadget.price.toLocaleString()}` : '-'}
            </p>
          </td>
        </tr>
        <tr>
          <th>
            <span className='gadget-info-header'>その他スペック</span>
          </th>
          <td>
            <p className='overflow'>{props.gadget.other_info || '-'}</p>
          </td>
        </tr>
        <tr>
          <th>
            <span className='gadget-info-header'>投稿者</span>
          </th>
          <td>
            <p className='overflow'>
              <Image
                src={
                  props.gadget.user.image.url === 'default.jpg'
                    ? '/images/default.jpg'
                    : props.gadget.user.image.url
                }
                width={50}
                height={50}
                alt='user-image'
              />
              <Link href={`/users/${props.gadget.user.id}`}>{props.gadget.user.name}</Link>
            </p>
          </td>
        </tr>
        <tr>
          <th>
            <span className='gadget-info-header'>最終更新</span>
          </th>
          <td>
            <p className='overflow' suppressHydrationWarning>
              {format(new Date(props.gadget.updated_at), 'yyyy/MM/dd HH:mm')}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
