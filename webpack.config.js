const path = require(`path`);
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const TerserPlugin = require(`terser-webpack-plugin`);
const OptimizeCSSAssetsPlugin = require(`optimize-css-assets-webpack-plugin`);
const BundleAnalyzerPlugin = require(`webpack-bundle-analyzer`).BundleAnalyzerPlugin;
const CopyPlugin = require(`copy-webpack-plugin`);
const { NormalModuleReplacementPlugin } = require(`webpack`);

const moduleName = `hints`;
const modulePath = `/${moduleName}`;
const isProduction = process.env.NODE_ENV === `production`;
const isServerMock = process.env.MOCK === `true`;
const widgetName = `hintswidget`;

// конфиг для чистки dist и дев-сервера(т.к. при нескольких конфигурациях dev-server берет настройки из первой)
const cleanConfig = {
  name: `clean`,
  entry: { clean: path.resolve(__dirname, `clean.js`) },
  output: {
    path: path.resolve(__dirname, `dist`)
  },
  plugins: [new CleanWebpackPlugin()], // чистим папку перед билдом
  devServer: {
    contentBase: path.resolve(__dirname, `dist`),
    port: 8080,
    host: `localhost`,
    publicPath: modulePath,
    historyApiFallback: {
      // Отдаем корневой index модуля на всех роутах, чтобы не получать 404 если мы пришли на роут извне
      // Например в приложении у нас есть роут module/login и без этой настройки при релоаде или открытии в новой вкладке получим 404
      // На проде такое поведение обеспечено настройкой location для nginx
      index: `${modulePath}/index.html`
    },
    proxy: [
      {
        // Проксируем все запросы вне модуля (в т.ч. на апи)
        // context: [`+(!(^${modulePath}*)|^${modulePath}/api*)`],
        context: path => {
          if (path.startsWith(`${modulePath}/api`)) {
            return true;
          } else if (path.startsWith(`${modulePath}`)) {
            return false;
          } else {
            return true;
          }
        },
        target: `http://api.ru/`,
        changeOrigin: true
      }
    ],
    open: true, // открываем модуль при запусте дев-сервера в браузере
    openPage: [`${moduleName}/`, `${moduleName}/widget.html`], // октрываем обе страницы для локальной разработки
    stats: {
      // настройки информации о ходе сборке в консоль
      all: false,
      modules: false,
      errors: true,
      warnings: true,
      errorDetails: true,
      colors: true,
      entrypoints: false,
      timings: true
    },
    overlay: true // выводим оверлей в браузере при ошибках сборки, чтобы сразу видеть в браузере, что сборка упала с ошибкой, а не только в консоли сборщика
  }
};

// конфиг для основного приложения
const appConfig = {
  entry: {
    app: path.resolve(__dirname, `app/js/index.js`)
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      // в проде сжимаем css и js
      new TerserPlugin({ sourceMap: true }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      // зависимости кладем в отдельный чанк, т.к. они могут не изменяться в отличие от основного кода и кешироваться браузером
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: `vendors`,
          chunks: `all`
        }
      }
    }
  },
  resolve: {
    alias: {
      'react-dom': `@hot-loader/react-dom` // подменяем react-dom на @hot-loader/react-dom для работы hmr в реакт-компонентах
    }
  },
  output: {
    path: path.resolve(__dirname, `dist`),
    /**
     * При возможной конфигурации виджета нужно учитывать, чтобы файл бандла не содержал хэшей, чтобы можно было всегда сослаться извне,
     * в настройках nginx нужно прописать location и expires 5m на этот файл чтобы внешние модули могли подкачивать всегда свежий виджет несмотря на ребилд.
     * Бандл виджета должен содержать css и зависимости - чтобы было проще подключать и использовать виджет.
     *
     */
    filename: isProduction ? `[name].bundle.[contenthash].js` : `[name].bundle.js`, // для локальной разработки не клеим хэш к бандлу, чтобы отрабатывал hmr. Для конфига виджета следует выбрать эту опцию во всех сборках.
    library: `[name]`,
    publicPath: modulePath
  },
  devtool: `source-map`,
  module: {
    rules: [
      {
        //обработка js, прогоняем через babel для корректной обработки jsx в react-компонентах
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: `babel-loader` }
      },
      {
        //обработка css
        test: [/\.css$/, /\.pcss$/],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : `style-loader`, // в проде компилим css в файл, но для локальной разработки не создаем, чтобы отрабатывал hmr. для конфига виджета этот лоадер следует отключить
          {
            loader: `css-loader`,
            options: {
              modules: {
                localIdentName: isProduction
                  ? `[local]_[contenthash:4]` // для прода добавляем сокращенный хэш в именах классов
                  : `[path][name]__[local]`, // для разработки используем понятные имена css-классов и путь, откуда прилетел стиль
                context: path.resolve(__dirname, `app/js`)
              },
              importLoaders: 1,
              sourceMap: true
            }
          },
          `postcss-loader`
        ]
      },
      {
        //обработка svg, создаем из них компоненты React через react-svg-loader
        test: /\.svg$/,
        issuer: /\.js?$/,
        use: [
          {
            loader: `babel-loader`
          },
          {
            loader: `react-svg-loader`,
            options: {
              jsx: true,
              svgo: {
                plugins: [{ removeViewBox: false }]
              }
            }
          }
        ]
      },
      {
        //обработка SVG из CSS
        test: [/\.svg$/],
        issuer: [/\.css$/, /\.pcss$/],
        loader: `file-loader`,
        options: {
          name: `[name].[contenthash].[ext]`,
          outputPath: `img`,
          publicPath: modulePath + `/img`
        }
      },
      {
        //обработка изображений
        test: [/\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/],
        loader: `file-loader`,
        options: {
          name: `[name].[contenthash].[ext]`,
          outputPath: `img`,
          publicPath: modulePath + `/img`
        }
      },
      {
        //обработка шрифтов
        test: [/\.ttf$/, /\.eot$/, /\.woff$/, /\.woff2$/],
        loader: `file-loader`,
        options: {
          name: `[name].[contenthash].[ext]`,
          outputPath: `fonts`,
          publicPath: modulePath + `/fonts`
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // плагин формирует новый html с подключенными стилями и бандлами
      filename: `index.html`,
      template: path.resolve(__dirname, `app/index.html`),
      chunks: [`app`, `vendors`] // явно указываем какие чанки подключать, т.к. имеем несколько entry
    }),
    new MiniCssExtractPlugin({
      // подключаем css в страницу. для конфига виджета этот плагин следует отключить
      filename: `[name].[contenthash].css`,
      chunkFilename: `[id].[contenthash].css`
    }),
    new CopyPlugin({
      patterns: [{ from: `./hintlist.json`, to: path.resolve(__dirname, `dist`) }]
    }),
    // заменяем модуль мока сервера на пустой, чтобы он не попадал в бандл
    isServerMock
      ? null
      : new NormalModuleReplacementPlugin(/(.*)server\.js/, path.resolve(__dirname, `app/js/server.empty.js`)),
    process.env.ANALYZE === `MAIN` ? new BundleAnalyzerPlugin() : null
  ].filter(Boolean),
  //Не печатать warn, если размер bundle превышает 250kb
  performance: { hints: false }
};

// конфиг для виджета
const widgetConfig = {
  name: widgetName,
  entry: { [widgetName]: path.resolve(__dirname, `widget/index.js`) },
  optimization: {
    minimize: isProduction,
    minimizer: appConfig.optimization.minimizer
  },
  output: {
    path: path.resolve(__dirname, `dist`),
    /**
     * При возможной конфигурации виджета нужно учитывать, чтобы файл бандла не содержал хэшей, чтобы можно было всегда сослаться извне,
     * в настройках nginx нужно прописать location и expires 5m на этот файл чтобы внешние модули могли подкачивать всегда свежий виджет несмотря на ребилд.
     * Бандл виджета должен содержать css и зависимости - чтобы было проще подключать и использовать виджет.
     *
     */
    filename: `[name].bundle.js`, //Для виджета в имя фала не генерим хэши, чтобы можно было подключить извне
    library: `[name]`,
    publicPath: modulePath
  },
  devtool: `source-map`,
  module: {
    rules: [
      {
        //обработка js, прогоняем через babel для корректной обработки jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: `babel-loader` }
      },
      {
        //обработка css
        test: [/\.css$/, /\.pcss$/],
        use: [
          {
            loader: `css-loader`,
            options: {
              modules: {
                localIdentName: isProduction
                  ? `[local]_[contenthash:4]` // для прода добавляем сокращенный хэш в именах классов
                  : `[path][name]__[local]`, // для разработки используем понятные имена css-классов и путь, откуда прилетел стиль
                context: path.resolve(__dirname, `app/js`)
              },
              importLoaders: 1,
              sourceMap: false
            }
          },
          `postcss-loader`
        ]
      },
      {
        // инлайним svg
        test: /\.svg$/,
        loader: `svg-inline-loader`
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // плагин формирует новый html с примером подключения виджета
      filename: `widget.html`,
      chunks: [widgetName],
      template: path.resolve(__dirname, `widget/index.html`)
    }),
    // заменяем модуль мока сервера на пустой, чтобы он не попадал в бандл
    isServerMock
      ? null
      : new NormalModuleReplacementPlugin(/(.*)server\.js/, path.resolve(__dirname, `app/js/server.empty.js`)),
    process.env.ANALYZE === `WIDGET` ? new BundleAnalyzerPlugin() : null
  ].filter(Boolean),
  performance: {
    // кидаем ошибку в проде, если виджет больше некоторого значения по размеру
    hints: isProduction ? `error` : false,
    maxEntrypointSize: 72000
  }
};

// webpack может принимать массив конфигов, если нужно обработать несколько entry. настройки для devServer берутся всегда из первого, в нем же чистим папку
module.exports = [cleanConfig, appConfig, widgetConfig];

/*
    UI должен поддерживать hot redeploy - клиент загружает entrypoint (index.html или widget.bundle.js)
    и хочет догрузить к нему его зависимости (картинки, html-шаблоны и т.п.). Мы должны выдать ему файлы
    той же версии, что и entrypoint - либо старой, либо новой. Если он загрузил старый entrypoint, а мы
    выдадим новый css, то нет гарантий, что они совместимы и не поедет верстка.

    Для этого мы добавляем в имена файлов hash от контента и entrypoint линкует нужную именно ему версию.
    На сервере мы держим и старую и новую версию файлов, поэтому клиент всегда может их загрузить.
*/

const hash = (+new Date()).toString(36);

function appendHash(filePath) {
  return `${filePath}?${hash}`; // добавляем хэш к запросу для получения браузером всегда свежей версии ресурсов после ребилда
}

// общие ресурсы
global.app = {};
global.app.resources = {
  // общий css, пример как подключается в html: <link rel="stylesheet" href="<%= global.app.resources.css.eaistShared %>" />
  css: {
    // содержат стили для шапки\сайдбара\модалки\custom properties для цветов и размеров
    eaistShared: appendHash(`/shared2/shared2.min.css`),
    // содержат стили для шапки\сайдбара\модалки\custom properties для цветов и размеров
    eaistPublic: appendHash(`/public/public.min.css`),
    // bootstrap и прочее
    eaistVendor: appendHash(`/vendor/vendor.min.css`),
    // общие стили, могут переопределять стили по тегам(!!)
    eaistPanel: appendHash(`/panel/panel.min.css`)
  },
  // общий js, пример как подключается в html: <script src="<%= global.app.resources.js.eaistLoader %>"></script>
  js: {
    //angularjs: проверка авторизации у пользователя и подключение приложения в верстку,
    //не нужно указывать ng-app="nameApp", добовляем через window.checkAuth('nameApp', angular);
    eaistAuthLib: appendHash(`/libs/libs.auth.min.js`),
    //несколько вспомогательных функций ("велосипедов") на js - редко используется
    eaistLibAll: appendHash(`/libs/libs.all.min.js`),
    //Модули вендоров AngularJS, JQuery, Bootstrap...
    eaistVendor: appendHash(`/vendor/vendor.common.min.js`),
    //Прелоадер страницы: window.eaistLoader(id, text, delay)
    eaistLoader: appendHash(`/app/common/native/loader/loader.js`),
    //angularjs: Модуль с общими директивами для всей системы
    eaist2SharedAll: appendHash(`/shared2/shared2.all.min.js`),
    //angularjs: Некоторые модули с обновлённым дизайном Header, Sidebar, Hpsm...
    eaist2Shared: appendHash(`/shared2/shared2.eaist2.min.js`),
    //Вывод блокирующего окна, при ошибки в коде. С возможностью отправки ошибки разработчикам. window.error_handler_methods
    eaistErrorHandler: appendHash(`/app/common/native/error-handler/error-handler.js`),
    //дефолтная страница авторизации на портал
    eaistLoginModule: appendHash(`/login/login.all.min.js`),
    //angularjs: модальное окно авторизации на портале
    loginHeaderDirective: appendHash(`/app/shared/login-header/login-header.directive.js`)
  }
};
