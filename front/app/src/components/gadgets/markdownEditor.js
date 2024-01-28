import { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DOMPurify from 'dompurify'
import 'easymde/dist/easymde.min.css'
import { marked } from 'marked'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export default function MarkdownEditor(props) {
  const [markdownValue, setMarkdownValue] = useState(props.initialReview ? props.initialReview : '')

  const onChange = (value) => {
    setMarkdownValue(value)
  }

  useEffect(() => {
    // 入力値が無い場合はプレースホルダーを表示して終了
    if (!markdownValue) {
      document.querySelector('#preview').innerHTML = 'ここにレビューのプレビューが表示されます'
      return
    }

    // 入力値がある場合は整形して表示
    const sanitizeMarkdown = () => {
      // マークダウンで許可するタグと属性を規定
      const allowedTags = [
        'strong',
        'em',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'a',
        'p',
        'ul',
        'ol',
        'li',
        'img',
      ]
      const allowedAttributes = ['href', 'cite', 'src', 'alt', 'target']
      // 規定に沿って入力値をエスケープ
      const sanitizedHtml = DOMPurify.sanitize(marked(markdownValue), {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttributes,
      })
      return { __html: sanitizedHtml }
    }
    // 入力値をHTML形式でプレビューに表示
    document.querySelector('#preview').innerHTML = sanitizeMarkdown().__html
    // 入力値をマークダウン形式でreviewに保存
    props.setFormData({ ...props.formData, ['review']: markdownValue })
  }, [markdownValue])

  // エディターの設定
  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      status: false,
      hideIcons: ['preview', 'image'],
    }
  }, [])

  // 「テンプレートを使用する」で挿入するテンプレ
  const insertTemplate = () => {
    const confirmed = window.confirm('現在入力しているレビューは削除されます。よろしいですか？')
    if (!confirmed) {
      return
    }

    const template = `***以下は、マウス「Kensington ExpertMouse」のレビュー例の抜粋です。***

***各ヘッダーと内容をお好みで編集してご利用ください。***

# どんなガジェット？
特大のトラックボールに加え、クリックボタンが左右対称に４つ備わっている独自のデザイン...

# ここが好き
大画面や複数モニターでも腕が疲れずに作業し続けられるのが最高...

# おすすめ使用方法や設定

## リストレスト
付属のリストレストはフィット感が良く、デザインもかっこいいのですが、革が少し硬くて痛いので外して使っています...

## 定期的な掃除
トラックボールの構造上、汚れがたまりやすいので、定期的にメンテナンスするのがおすすめ...

## 複数デバイスでの併用
このマウスは残念ながらマルチペアリングには非対応となっていますが、Bluetoothと、USBレシーバーの無線2.4GHz接続を利用することで、２台までなら同じようなことができます...

# ここは注意かも
## 操作への慣れ
特殊な操作方法なので、慣れるのにはしばらく時間がかかるかと...

## 持ち運び
トラックボールは固定されていないので、逆さまにすると落ちます...

# 最後に 
大画面で作業している人には特におすすめ...
`
    setMarkdownValue(template)
  }

  return (
    <>
      <div className='review-header'>
        <div className='review-content'>
          <div id='preview'></div>
        </div>
      </div>
      <label className='form-label'>
        <span>レビュー</span>
        <span className='add-template' onClick={insertTemplate}>
          <FontAwesomeIcon icon={faCirclePlus} />
          テンプレートを使用する
        </span>
      </label>
      <SimpleMDE
        value={markdownValue}
        onChange={onChange}
        options={autofocusNoSpellcheckerOptions}
      />
    </>
  )
}
