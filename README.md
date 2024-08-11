# quanum

## Para rodar localmente

- copie o .env.example criando o .env
  - com o comando `cp .env.example .env`
- execute `npm run serve`

## O projeto está deployado no heroku

- https://quanum.herokuapp.com/

## Comando para iniciando projeto vue

- rodando o comando vue create para inicializar o projeto
  - https://cli.vuejs.org/guide/creating-a-project.html#vue-create
  ```sh
  vue create quanum
  ```

## Preparando multi-idioma

- ler post publicado em https://www.freecodecamp.org/news/how-to-add-internationalization-to-a-vue-application-d9cfdcabb03b/
- instalar pacotes que possibilitarão a configuração das telas podendo chavear entre idiomas

```sh
npm install vue-i18n --save
```

## Preparando estilização com Bootstrap

- ler post publicado em https://www.devmedia.com.br/estilizando-uma-aplicacao-vue-js-com-bootstrap/42977
- instalar pacotes do bootstrap

```sh
npm install bootstrap-vue bootstrap
```

## Preparando Mock API no POSTMAN para emular idas na API

- Recupere a collection com os exemplos na seguinte URL: https://www.getpostman.com/collections/229de747d3731309bed6

## Utilizando a apexcharts para lidar com os gráficos

- https://apexcharts.com/docs/vue-charts/
- tem uma grande lista de tipos de gráfico
  - https://apexcharts.com/docs/chart-types/radar/
