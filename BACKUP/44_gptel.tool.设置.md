# [gptel tool 设置](https://github.com/VandeeFeng/gitmemo/issues/44)

好久没关注 [gptel](https://github.com/karthink/gptel) 的更新，居然支持自定义 tool 了，可以调用支持 function calling 的模型，这可太方便了。

[aichat](https://github.com/sigoden/aichat) 也支持自定义 tool，之前一直用本地模型，没有怎么关注 tool 调用，又有很多好玩的可以玩了。

> [Mozilla just changed the Firefox TOS. - X](https://x.com/theo/status/1895247223577026832) 
>
> Mozilla 更新的 Firefox 服务条款，由 Theo 强调，授予公司一个非独占的、免版税的、全球性的许可，以使用用户上传或输入的数据，这引发了隐私倡导者对潜在滥用的担忧，尽管 Mozilla 保证这是为了增强浏览功能。

这可咋办。。。一直用的 Firefox。

已经用上 LibreWolf 了。  #47 

加上了用 jina.ai reader 获取网页内容：

```
  (gptel-make-tool
   :function (lambda (url)
               (let* ((proxy-url (concat "https://r.jina.ai/" url))
                      (buffer (url-retrieve-synchronously proxy-url)))
                 (with-current-buffer buffer
                   (goto-char (point-min)) (forward-paragraph)
                   (let ((dom (libxml-parse-html-region (point) (point-max))))
                     (run-at-time 0 nil #'kill-buffer (current-buffer))
                     (with-temp-buffer
                       (shr-insert-document dom)
                       (buffer-substring-no-properties (point-min) (point-max)))))))
   :name "read_url"
   :description "Fetch and read the contents of a URL using Jina.ai reader"
   :args (list '(:name "url"
                       :type "string"
                       :description "The URL to read"))
   :category "web")

```
之前一直用的 ollama，没有配置其他模型，用 `.authinfo` 读取 API KEY：

```
  :config
  (let* ((auth-info (car (auth-source-search :host "generativelanguage.googleapis.com")))
         (api-key (and auth-info (plist-get auth-info :secret)))) 
    (if api-key
        (setq
         gptel-model "Gemini"
         gptel-backend (gptel-make-gemini "Gemini"
                         :stream t
                         :key api-key
                         :models '("gemini-2.0-flash"))
         )
      (error "未在 auth-source 中找到 Gemini API 密钥！请检查您的 auth-source 配置。")))
```