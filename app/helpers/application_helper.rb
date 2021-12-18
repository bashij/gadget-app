module ApplicationHelper
  # "Gadget-App"を基本としつつ、ページごとにタイトルを切り替える
  def full_title(page_title = '')
    base_title = 'Gadget-App'
    if page_title.empty?
      base_title
    else
      "#{base_title} | #{page_title}"
    end
  end
end
