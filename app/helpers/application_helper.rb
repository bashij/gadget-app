module ApplicationHelper
  # "GadgetLink"を基本としつつ、ページごとにタイトルを切り替える
  def full_title(page_title = '')
    base_title = 'GadgetLink'
    if page_title.empty?
      base_title
    else
      "#{base_title} | #{page_title}"
    end
  end
end
