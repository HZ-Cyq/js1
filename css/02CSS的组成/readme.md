## 1、在HTML中应用CSS
### 1.1 外部样式表
使用html的link元素链接外部样式表文件
```
<link rel="stylesheet" href="style.css"></link>
```
### 1.2 内部样式表
样式表也可以驻留在html文档内部，需要将其放在**head元素的style标签**内
```
<!doctype html>
<html>
    <head>
        <style>
            h1 {
                color:red;
            }
        </style>
    </head>
    <body>
        <h1>hello</h1>
    </body>
</html>
```
### 1.3 内联样式
尽可能避免以这种方式使用css,这不符号最佳实践，它将css和html混在一起。
```
<!doctype html>
<head>
</head>
<body>
    <h1 style="color:blur; background-color:yellow; border: 1px solid black">
        hello world
    </h1>
</body>
```
## 2、跟随文本玩转CSS样式

## 3、选择器
优先级：
CSS语言有一些规则来控制在发生冲突的情况下哪个选择器更强大，这些规则被称为层叠和优先级  
层叠规则：后面的样式会替换样式表中较早出现的冲突样式。
## 4、属性和值
在基本的层面上，CSS由两个组成部分组成:
- 属性：人类可读的标识符，指示想要更改的样式特征，如font-size、width、background-color
- 值：每个属性都有一个值，这个值表示如何对属性施加样
当一个属性和一个值**配对**时，这种配对被称为CSS声明，CSS声明可以在CSS声明块中找到。CSS声明块和选择器配对，以生成CSS规则集。
### 4.1、函数
    虽然大多数值是相对简单的关键字和值，但也有一些值是以函数的形式出现。
#### 4.1.1 calc()函数
    这个函数允许在CSS中进行简单的计算
#### 4.1.2 Transform()函数
## 5、@规则
## 6、简写属性
## 7、注释
## 8、空白