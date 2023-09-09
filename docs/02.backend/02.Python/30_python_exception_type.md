<!--
    作者：华校专
    email: huaxz1986@163.com
**  本文档可用于个人学习目的，不得用于商业目的  **
-->
# 异常对象
1.Python3中，内置异常与用户自定义异常都是类的实例对象

2.在`try...except`语句进行`except ExceptionType`子句匹配时，采用的是`isinstance(exception_obj,ExceptionType)`这种匹配规则。因此如果`ExceptionType`是`exception_obj`所属类的超类，则匹配也成功。

3.Python中的内置异常类继承树：

~~~mermaid
graph BT
id1(OverflowError) -->|继承|id2(ArithmeticError)
id2 -->|继承|id3(Exception)
id4(IndexError) -->|继承|id3
id3-->|继承|id5(BaseException)
~~~

* 用户自定义异常类不要直接从`BaseException`继承。`BaseException`提供了默认的打印和状态保持行为
	* 在构造时传给异常类的所有参数都将作为一个元组存储在`.args`属性中
	* 在构造时传入的字符串作为`.__str(self)__`方法返回。如果传入的不是字符串，
	  则将先调用`str()`将该参数转换为字符串
* `Exception`是所有内置异常类的超类。用户自定义的异常类都继承自它
	* 系统退出事件`SystemExit`、`KeyboardInterrupt`、`GeneratorExit`不能继承自它  

  ![BaseException](../imgs/python_30_1.JPG)

4.自定义异常类：通常继承自`Exception`类

* 若想自定义打印显示，则必须重写`.__str__(self)`方法
* 如果想定制初始化方法，必须重写`.__init__(self,args)`方法。此时超类的`.args`属性同样也会起作用  

  ![用户的自定义异常类](../imgs/python_30_2.JPG)

5.Python在运行时会将`try`语句放入堆栈中。抛出异常时，Python跳转至最近的`try`块中，找到匹配该异常的异常处理器（即`except子句`)，执行异常处理的`except`子句。一旦异常被捕获并且处理，则其生命周期结束

* 异常的传递：向上返回到先前进入但是尚未离开的`try`

6.Python中所有的错误都是异常。但是并非所有的异常都是错误

* 内置的`input`函数每次调用时，遇到文件末尾时引发内置的`EOFError`
* 调用`sys.exit()`会触发`SystemExit`异常
* 在键盘上按下`Ctrl-C`键时，会触发`KeyboardInterrupt`异常  

  ![系统级的异常事件](../imgs/python_30_3.JPG)

7.用户自定义的异常可以用于触发信号条件。这是利用异常来传递信息的方法

8.`try...finally`通常用于释放系统资源。虽然垃圾收集时资源会自动释放，但是垃圾收集的时机不可控，由算法自动调度

9.可以在顶层代码中使用`try`以及空的`except`来进行调试，从捕获程序有什么意外情况发生

10.`sys.exc_info()`函数返回最近引发的异常信息，它返回一个三元素的元组：`(type,value,traceback)`

* `type`：异常类型
* `value`：异常实例对象
* `traceback`：一个`traceback`对象，代表异常发生时所调用的堆栈

  ![sys.exc_info函数](../imgs/python_30_4.JPG)

11.为了拦截具体的异常，`except `应该具体化，避免拦截无关事件

* 空的`except`子句拦截任何异常，包括内存错误、系统推出、键盘中断等等
* 但是太具体化不利于扩展

