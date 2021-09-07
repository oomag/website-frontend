# README

## DEPLOYMENT
1. Склонировать репозиторий
2. установить рассгирения 
   ```
   yarn install
3. Сгенерировать статику
   ```
   gulp build
3. в конфигах nginx прописать
   ```
   location / {
        if ($request_uri ~ ^/(.*)\.html) {
        return 302 /$1;
   }
        try_files $uri $uri.html $uri/ =404;
   }

## DEPLYMENT в docker (пример)

Результат билда, контейнер nginx отдающий статику сайта 

```
docker build -t oomag:latest .
```
