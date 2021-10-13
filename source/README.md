我的Github博客

## 特性
* [github](https://github.com/facebook/react)
* [next]

## 需求配置


## 开始

在开始之前，需要安装以下环境：

```ReactNative
 Pods
```

确认好你的环境配置，然后开始以下步骤。

```bash
 $ npm install                  # Install react-native project dependencies
 $ pod install                  # Install this project dependent third-lib
```

 然后，打开 Xcode ，Command + R 运行，可能会有以下编译报错：
 
 ```
（以下是在  *react-native 0.44.0*  版本情况下）

 * RNDeviceInfo 库中 RCTBridgeModule.h 文件报 'React/RCTDefines.h' file not found ，修改 #import <React/RCTDefines.h> 为 #import "RCTDefines.h"

 * React 库中 RCTNativeAnimatedNodesManager.h 文件报 'RCTAnimation/RCTValueAnimatedNode.h' file not found ,修改 #import <RCTAnimation/RCTValueAnimatedNode.h> 为 #import "RCTValueAnimatedNode.h"
 
 * 工程依赖的 react-native 第三方库找不到 React 路径问题：
 在 Build Settings -> Header Search Paths 里添加 $(SRCROOT)/../../../iShanggang/Pods/Headers/Public"
 
```

## 注意

```

每次生成之后、上传之前，手动将README.md复制到public目录，并删除README.html

```



