## 1、先从html开始
## 2、添加CSS试试看？
## 3、样式化HTML元素
## 4、改变元素的默认行为
## 5、使用类名
```
.special {
    color: orange;
    font-weight: bold;
}
```
html选择器跟类一起出现，这个意思是说“选中每个special类的li元素” 如：
```
li.special {
    color:orange;
}
```
但是一般情况下，我们都只看类，不管元素。一般情况下，所有的类的样式都是一样的。
## 6、根据元素在文档中的位置确定样式
有时候，如果希望某些内容根据它在文档中的位置而有所不同，可以使用有**包含选择符**和**相邻选择符**的选择器。

包含选择符（两个元素之间添加一个空格）：代表所有在li元素里的em元素

```
li em {
    color: rebeccapurple
}
```

相邻选择符（两个元素之间添加一个空格）：代表直接出现在标题元素**后面**并且与标题具有**相同层级**的段落样式

## 7、根据状态确定样式
如果希望根据标签的状态确定样式，可以使用":"

未被访问过的
```
a:link {
    color: pink;
}
```

访问过的
```
a:visited {
    color: green;
}
```

## 8、同时使用选择器和选择符

```
<!-- selects any <span> that is inside a <p>, which is inside an <article>-->
atricle p span {

}
<!-- slects any <p> that comes directly after a <ul>, which comes directly after an <h1> -->
h1 + ul + p {

}
<!-- 在body内，紧跟h1的p元素内，类名为special -->
body h1+p .special {
    color: yellow;
    background-color: black;
    padding: 5px;
}
```