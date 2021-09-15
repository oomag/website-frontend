# README

## DEPLOYMENT
1. Склонировать репозиторий
2. Установить расширения 
   ```
   yarn install
3. Сгенерировать статику
   ```
   CONTACTUS_URL=<contact us server url> gulp build
3. в конфигах nginx прописать
   ```
   location / {
        if ($request_uri ~ ^/(.*)\.html) {
        return 302 /$1;
   }
        try_files $uri $uri.html $uri/ =404;
   }

## DEPLOYMENT в docker (пример)

При деплое, надо передать билд параметр `contactus_url` с полным урлом 
сервера отправки формы (напр. http://localhost:3000/contact-us) 

Результат билда, контейнер nginx отдающий статику сайта 

```
docker build --build-arg contactus_url=<some_url> -t oomag:latest .
```
