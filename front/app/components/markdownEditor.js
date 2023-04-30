import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DOMPurify from 'dompurify'
import 'easymde/dist/easymde.min.css'
import { marked } from 'marked'

import dynamic from 'next/dynamic'

import { useEffect, useMemo, useState } from 'react'

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
    const confirmed = window.confirm('既存のレビューは削除されます。よろしいですか？')
    if (!confirmed) {
      return
    }

    const template = `# ○○の特徴
このガジェットの特徴は...

# 導入のきっかけ
○○の作業を効率化するため...

# イイところ
## ①
独自のキー配列により、ホームポジションを崩さずタイピングが...
## ②
キーマップのカスタマイズが自由にでき...
## ③
無駄を削ぎ落としたデザインで...

# イマイチなところ
## ①
慣れるまでに少し時間が...
## ②
価格が高く導入にハードルが...
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
