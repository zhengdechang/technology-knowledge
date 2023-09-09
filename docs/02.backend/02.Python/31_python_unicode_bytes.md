<!--
    作者：华校专
    email: huaxz1986@163.com
**  本文档可用于个人学习目的，不得用于商业目的  **
-->
# Unicode与字节串
1.字符编码：

* `ASCII`编码：每个字符存储在一个字节中。字符码值从 0~127
* `Latin-1`编码：每个字符存储在一个字节中。字符码值从 0～255。其中码值128～255分配给特殊字符；码值0～127部分与
  `ASCII`编码相同。
* `UTF-8`编码：每个字符存储的字节数量可变，不再是固定编码
	> `ASCII`编码是`UTF-8`编码的子集，也是`Latin-1`编码的子集

2.`Unicode`文本通常叫做“宽字符”字符串，因为每个字符可能表示为多个字节

3.查看字符的`Unicode`码值： `ord()`函数；
查看`Unicode`码值对应的字符：`chr()`函数
>这里的`Unicode`码值都是整数，可以是十进制、二进制、八进制、十六进制整数等

![字符与Unicode码值的转换](../imgs/python_31_1.JPG)

4.Python大约支持上百中不同的编码。可以导入`encodings`模块，并运行`help(encodings)`显示很多编码名称。有一些编码是Python中实现的，一些是C中实现的。
>有些编码对应多个不同的名称

![encodings模块](../imgs/python_31_2.JPG)

5.Python3中有三种字符串相关类型：

* `str`类型表示`Unicode`文本（8位和更宽的位数），为不可变的字符序列，称为字符串
* `bytes`表示二进制数据，称为字节串。`bytes`对象其实是小整数的一个序列，每个整数的范围在0～255之间。
	* 索引一个`bytes`实例返回一个整数
	* 分片一个`bytes`实例返回一个新的`bytes`实例
	* `list(bytes_obj)`返回一个整数列表而不是字符列表
	> `bytes`类型几乎支持所有的`str`操作，但是不支持字符串格式化操作（没有字节串格式化操作）

* `bytearray`是一种可变的`bytes`类型，称为可变字节串。`bytearray`是`bytes`的一个变体，
  它是可变的且支持原地修改。它支持`str`与`bytes`的常见操作，以及与列表相同的一些原地修改操作。

  ![str、bytes、bytearray](../imgs/python_31_3.JPG)

6.`sys.getdefaultencoding()`函数返回平台默认的编码方式。`sys.getfilesystemencoding()`返回系统文件的默认编码方式。

  ![系统默认编码](../imgs/python_31_4.JPG)

7.Python3中，当一个文件以文本模式打开时，读取其数据会自动将其内容解码，并返回一个字符串；当一个文件以文本模式写打开时，写入一个字符串会在将该字符串写入文件之前自动编码它。

* 编码和解码的类型是系统的平台默认编码类型，或者你手动设定的编码类型
* 根据编码类型，Python自动处理文件起始处的字节标记序列（通常用于标记文件编码类型）
* Python自动对行尾换行符转换。在windows下，换行符`\n`在写入文件时转换为windows下的换行符`\r\n`。在读取文件时windows下的换行符`\r\n`转换为标准换行符`\n`

当一个文件以二进制模式打开时，读取其数据直接返回其原生内容而并不以任何方式解码，也不做任何方式修改（即不转换换行符），直接作为`bytes`实例返回；写入会接受一个`bytes`实例或者一个`bytearray`实例，并且不加修改地写入到文件（即不转换换行符）

  ![文件和编码](../imgs/python_31_5.JPG)

8.在Python3中，`'xxx'`、 `"xxx"` 、`'''xxx'''`均创建一个字符串常量，而添加一个`b`或者`B`中创建一个`bytes`常量`b'xxx'`、 `B"xxx"` 、`b'''xxx'''`

* 尽管`bytes`打印出来是字符串（若无对应的字符则输出内存表示），但它本质上是一个小整数序列
* Python3中所有字符串都是Unicode字符（是ASCII字符的超集）

  ![bytes常量](../imgs/python_31_6.JPG)

9.Python3中，虽然字符串与`bytes`的内存表示相同，但是二者不能混用，因为二者无法自动转换。对于期待一个`str`实例作为参数的函数，它不能接受一个`bytes`实例；反之亦然

* 字符串的`.encode(encoding)`方法和`bytes`的`bytes(a_string,encoding)`函数将一个字符串实例转换为它原生`bytes`形式
* 字符串的`str(a_bytes,encoding)`函数和`bytes`的`.decode(encoding)`方法将一个`bytes`实例解码成字符串形式。

>字符串的`.encode(encoding)`方法的`encoding`参数可以为空，此时表示使用平台默认编码

>`str(a_bytes)`函数返回的是`bytes`实例的打印字符串，而不是执行编码转换过程

  ![bytes和字符串的编解码](../imgs/python_31_7.JPG)

10.Python的字符串常量支持：

* `'\xNN'`：单字节字符（8位），等价于`\u00NN`
* `'\uNNNN'`：双字节字符，16位
* `'\UNNNNNNNN'`：4字节字符，32位
	>这里的`N`均为十六进制整数的一个整数位[0~F]

  ![单字节字符与多字节字符](../imgs/python_31_8.JPG)

11.编解码ASCII字符非常简单，无需显示指定编解码类型（当然你可以随意指定一个编解码类型，因为ASCII编码是任何编码类型的子集）

  ![ASCII字符编码](../imgs/python_31_9.JPG)

编解码非ASCII字符则要注意，对该字符的编码类型必须与解码类型一致，否则乱码或者抛出`UnicodeDecodeError`。

  ![ASCII字符编码](../imgs/python_31_10.JPG)

12.生成Unicode字符串你可以通过Unicode转义序列来创建，如`'A\u4e2d\u56fd'`；也可以通过`chr()`函数来创建，如
  `'A'+chr(0x4e2d)+chr(0x56fd)`，最终结果都是`'A中国'`

13.字符串常量与`bytes`常量区别：

* 对字符串常量，`'\xNN'`与`'\u00NN'`是等价的；对`bytes`常量，`b'\xNN'`与`b'\u00NN'`是不等的
	>`b'\xE8'`长度为2字节，`b'\u00E8'`长度为6字节
* 字符串常量可以包含任意字符；`bytes`常量要求字符要么是ASCII字符，要么是转义字符
* `len(string_literal)`得到字符串常量的字符个数；`len(bytes_literal)`得到`bytes`常量的字节数

  ![字符串常量与bytes常量](../imgs/python_31_11.JPG)

14.指定Python源文件字符集编码声明：在脚本的第一行写入：

```
# -*- coding: latin-1 -*-
```

15.`bytes`实例的构造：

* `b'abc'`：构造`bytes`常量
* `bytes('abc',encoding='ascii')`：通过构造函数传入字符串和编码构造
* `bytes([97,98,99])`：通过传入小整数可迭代对象构造
* `'abc'.encode('ascii')`：从字符串编码获取

16.`bytearray`实例的构造：

* `bytearray('abc',encoding='ascii')`：通过构造函数传入字符串和编码构造
* `bytearray(b'abc')`：通过`bytes`常量构造

  ![bytes构造与bytearray构造](../imgs/python_31_12.JPG)

17.打开文件时，可以通过`encoding`关键字参数指定打开文件的编码方式

18.Python的`struct`模块可以从字符串创建和提取打包的`bytes`

19.`pickle`模块存储`pickle`化的对象用的是`bytes`

