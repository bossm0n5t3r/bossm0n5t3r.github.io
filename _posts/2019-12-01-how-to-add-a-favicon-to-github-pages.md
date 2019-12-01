---
layout: post
title: "깃허브 페이지에 파비콘 추가하기"
description: "깃허브 페이지에 파비콘 추가하기"
categories: [깃허브 페이지, github pages, 파비콘, favicon]
tags: [깃허브 페이지, github pages, 파비콘, favicon]
redirect_from:
  - /2019/12/01/
use_math: false
---

# 깃허브 페이지에 파비콘 추가하기

<img src="/assets/images/posts/2019-12-01-how-to-add-a-favicon-to-github-pages/GitHub-Mark-120px-plus.png">

## Favicon 만들기

- 간단하다. 본인만의 favicon을 만들고 싶다면 무료 생성 사이트에서 만들어보자.
  - [https://favicon.io/](https://favicon.io/)
- 저작권에 걸리지 않고 싶다면 그냥 직접 만들어보자.
- 만든 다음 assets 폴더(혹은 이미지 저장하는 폴더)에 잘 저장해두도록 하자.

## 링크 추가하기

- 링크를 추가해야하는데, 그에 앞서 어디에 추가해야 하는지 파악해야한다.
- 각 github pages 테마마다 형식이 다르므로 잘 찾아보자.
- 보통은 index.html 파일 혹은 header.html 파일이 공통적인 부분이므로 먼저 있는지 찾아보자.
  - 본인의 테마같은 경우 meta.html 파일이 공통 head 부분이므로 여기에 추가했다.
- 찾은 다음에 <head> 부분에 다음 코드를 넣어주면 된다.
  - ```html
    <link
      rel="shortcut icon"
      type="image/x-icon"
      href="{{ site.baseurl }}/assets/favicon_io/favicon.ico"
    />
    ```
  - 실제로는 href 부분에서 href="{{ site.baseurl }}/assets/favicon_io/favicon.ico" 이지만 {{ site.baseurl }} 이 안보이기 때문에 따로 표시합니다.
  - href 부분에서 본인이 넣은 폴더와 이미지 파일명을 넣어주면 된다.
- 커밋 후 제대로 적용되었는지 확인해보자.

## References

- [https://medium.com/@LazaroIbanez/how-to-add-a-favicon-to-github-pages-403935604460](https://medium.com/@LazaroIbanez/how-to-add-a-favicon-to-github-pages-403935604460)
- [https://blog.naver.com/PostView.nhn?blogId=prt1004dms&logNo=221451802933](https://blog.naver.com/PostView.nhn?blogId=prt1004dms&logNo=221451802933)
