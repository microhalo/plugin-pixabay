# plugin-pixabay

Halo 2.0 接入 [Pixabay](https://pixabay.com/) 的插件（WIP）

> 当前仅可作为测试使用。

## 开发环境

```bash
git clone https://github.com/microhalo/plugin-pixabay
```

```bash
cd path/to/plugin-pixabay
```

```bash
./gradlew build
```

修改 Halo 配置文件：

```yaml
halo:
  plugin:
    runtime-mode: development
    classes-directories:
      - "build/classes"
      - "build/resources"
    lib-directories:
      - "libs"
    fixedPluginPath:
      - "/path/to/plugin-pixabay"
```

## 安装与使用

1. 目前设置了 GitHub Action 的 Push 构建，你可以在 <https://github.com/microhalo/plugin-pixabay/actions> 的每个构建详情中下载最新构建的 JAR 文件。
2. 在 Halo 后台的插件管理上传 JAR 文件进行安装。
3. 启动该插件之后，需要在设置中配置 Pixabay 的 Access Key，详情可查阅：<https://pixabay.com/developers>
4. 完成 Access Key 配置后，在后台任意位置选择附件的弹框中选择 Pixabay 选项卡，即可使用 Pixabay 的图片。

## 截图

| ![](./screenshots/pixabay1.png)     | ![](./screenshots/pixabay2.jpg) |
|-------------------------------------|-------------------------------|

