
const { formElements } = require("@rails/ujs")
window.onload = function() {
  // templateコンテンツを挿入する
  const activateTemplate = () => {
    // テンプレを作成
    var template = "<h1>このガジェットについて</h1><p>このガジェットは...<br><br></p><h1>導入したきっかけ</h1><p>〜〜の作業を効率化するため...<br><br></p><h1>いいところ</h1><p>デザインが良く省スペースで...<br><br></p><h1>いまいちなところ</h1><p>電池の減りが早く...</p>"  
    // フォームに追加
    document.getElementById("gadget_review").value += template;
  };
  // 「テンプレートを使用する」がクリックされたときに実行
  var add_template_link = document.getElementById('rich_text_template');
  if (typeof add_template_link !== 'undefined' && add_template_link !== null) {
    add_template_link.addEventListener('click', activateTemplate);
  };

  const changeTweetClass = () => {
    switch_button_all_tweet.classList.toggle('active')
    switch_button_following_tweet.classList.toggle('active')
  }
  const changeGadgetClass = () => {
    switch_button_all_gadget.classList.toggle('active')
    switch_button_following_gadget.classList.toggle('active')
  }
  // switchボタンの見た目を制御
  var switch_button_all_tweet = document.getElementsByClassName('switch-item')[0]
  var switch_button_following_tweet = document.getElementsByClassName('switch-item')[1]
  var switch_button_all_gadget = document.getElementsByClassName('switch-item')[2]
  var switch_button_following_gadget = document.getElementsByClassName('switch-item')[3]
  if (typeof switch_button_all_tweet !== 'undefined' && switch_button_all_tweet !== null) {
    switch_button_all_tweet.addEventListener('click', changeTweetClass);
    switch_button_following_tweet.addEventListener('click', changeTweetClass);
    switch_button_all_gadget.addEventListener('click', changeGadgetClass);
    switch_button_following_gadget.addEventListener('click', changeGadgetClass);
  };  
}
