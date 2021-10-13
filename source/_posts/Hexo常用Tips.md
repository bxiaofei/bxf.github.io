---
title: Hexo常用Tips
date: 2018-05-15 22:02:41
tags:
---

## 推荐

[Hexo 安装](https://hexo.io/zh-cn/docs/index.html)
[Next 主题配置](http://theme-next.iissnan.com/getting-started.html)
[Markdown 编辑阅读器](https://www.zybuluo.com/mdeditor)

## 常用命令

{% codeblock %}
$ hexo new "postName" #新建文章
$ hexo new page "pageName" #新建页面
$ hexo generate #生成静态页面至public目录
$ hexo server #启动服务器（默认端口4000，'ctrl + c'关闭server）
$ hexo deploy #部署到GitHub
$ hexo help  # 查看帮助
$ hexo version  #查看Hexo的版本
{% endcodeblock %}

### 1.每次部署，重复以下步骤
{% codeblock %}
$ hexo c #清理
$ hexo g #生成
$ hexo s #启动服务
$ hexo d #部署
{% endcodeblock %}

### 2.写博客
定位到我们的hexo根目录，执行命令： hexo new 'my-blog'
hexo会帮我们在_posts下生成相关md文件
我们只需要打开这个文件就可以开始写博客了

## 一些样式
{% note class_name %} 引用 {% endnote %}

{% codeblock [title] [lang:language] [url] [link text] %}
code snippet
{% endcodeblock %}

``` [language] [title] [url] [link text] code snippet ```

{% link text url [external] [title] %}

{% post_link slug [title] %}

## 其它
##### 1.hexo new page "first" 和 hexo new "first" 有什么区别？
hexo new page "first" 最终部署时生成：hexo\public\first\index.html，但是它不会作为文章出现在博文目录。

##### 2.如何让博文列表不显示全部内容？
在文章中加一个 <!--more--> ， <!--more--> 后面的内容就不会显示出来了
