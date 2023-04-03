import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

export default function GadgetDetail(props) {
  return (
    <table className='table table-sm'>
      <tbody>
        <tr>
          <th>ガジェット名</th>
          <td>
            <p className='overflow'>
              <Link href={`/gadgets/${props.gadget.id}`}>{props.gadget.name}</Link>
            </p>
          </td>
        </tr>
        <tr>
          <th>カテゴリ</th>
          <td>
            <p className='overflow'>{props.gadget.category}</p>
          </td>
        </tr>
        <tr>
          <th>型番</th>
          <td>
            <p className='overflow'>{props.gadget.model_number}</p>
          </td>
        </tr>
        <tr>
          <th>メーカー</th>
          <td>
            <p className='overflow'>{props.gadget.manufacturer}</p>
          </td>
        </tr>
        <tr>
          <th>価格</th>
          <td>
            {props.gadget.price ? (
              <p className='overflow'>¥{props.gadget.price.toLocaleString()}</p>
            ) : (
              <p className='overflow'></p>
            )}
          </td>
        </tr>
        <tr>
          <th>その他情報</th>
          <td>
            <p className='overflow'>{props.gadget.other_info}</p>
          </td>
        </tr>
        <tr>
          <th>投稿者</th>
          <td>
            <p className='overflow'>
              <Image
                src={
                  props.gadget.user.image.url == 'default.jpg'
                    ? '/images/default.jpg'
                    : `https://static.gadgetlink-app.com${props.gadget.user.image.url}`
                }
                width={50}
                height={50}
                alt='user-image'
              />
              <Link href=''>{props.gadget.user.name}</Link>
            </p>
          </td>
        </tr>
        <tr>
          <th>最終更新</th>
          <td>
            <p className='overflow' suppressHydrationWarning>
              {format(new Date(props.gadget.created_at), 'yyyy/MM/dd HH:mm')}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
