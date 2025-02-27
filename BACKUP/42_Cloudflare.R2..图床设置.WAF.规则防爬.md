# [Cloudflare R2  图床设置 WAF 规则防爬](https://github.com/VandeeFeng/gitmemo/issues/42)

之前用 GitHub 当图床，一个是访问的速度很慢，再一个总觉得滥用了资源。

还是转到 Cloudflare R2 了。
 
- Scrape Shield => Hotlink Protection，打开
- Security => WAF => Custom rules，设置自定义规则。

<img alt=WAF-rules src='https://github.com/user-attachments/assets/eb78622b-3e33-4d91-be16-9408bfed8e30' width='50%'>

设置了才知道之前图片被爬了多少次。。。