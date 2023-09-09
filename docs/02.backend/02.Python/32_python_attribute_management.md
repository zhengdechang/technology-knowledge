<!--
    作者：华校专
    email: huaxz1986@163.com
**  本文档可用于个人学习目的，不得用于商业目的  **
-->
# 管理属性
1.管理属性的工具

* `.__getattr__(self,name)`方法：拦截所有未定义属性的读取（它要么返回一个值，要么抛出`AttributeError`异常；`.__setattr__(self,name,value)`方法：拦截所有属性的读取赋值（包括未定义的、已定义的）
* `.__getattribute__(self,name)`方法：拦截所有属性的读取（包括未定义的、已定义的）
* `property`特性：将特定属性访问定位到`get`方法和`set`方法
* 描述符协议：将特定属性访问定位到具有任意`get`和`set`方法的实例对象

2.`property`：每个`property`管理一个单一的、特定的属性。用法为：

```
class A:	
	def fget(...):
		pass
	def fset(...):
		pass
	def fdel(...):
		pass
	attribute=property(fget,fset,fdel,"doc")  #必须在fget,fset,fdel之后定义
a=A()
a.attribute #调用的是property特性
```

* `property()`函数返回的是一个`property`对象
* 子类继承了超类的`property`，就和类的普通属性一样

  ![property](../imgs/python_32_1.JPG)

3.描述符：描述符是作为独立的类创建，它的实例是赋值给了类属性

* 描述符的实例可以由子类继承
* 描述符的实例管理一个单一的特定的属性
* 从技术上讲，`property()`创建的是一个描述符实例（`property`实例）
* 描述符实例针对想要拦截的属性名访问操作，它提供了特定的方法

描述符类的接口为（即描述符协议）：

```
class Descriptor:
	'''
	This is docstring
	'''
	def __get__(self,instance,owner):
		pass
	def __set__(self,instance,value):
		pass
	def __delete__(self,instance):
		pass
class A:
	attr=Descriptor()
	...
```

* `instance`参数为：
	* `None`：当用于类的属性访问时（如`cls.attr`）
	* 类`A`的实例对象：当用于实例的属性访问时（如`instance.attr`）
* `owner`参数为：使用该描述符的类`A`
* 当访问类实例或者类属性时，自动调用该类的描述符实例的方法。如果该类的描述符中某些方法空缺则：
	* 若` __set__(self,instance,value)`未定义，则写该属性抛出`AttributeError`，该属性只读
	* 若` __get__(self,instance,owner)`未定义，则读该属性返回一个`Descriptor`实例，
	  因为从继承树中可知，该属性返回由类的`attr`变量名指定的对象
* 状态信息可以保持在实例对象中，也可以保存在描述符实例中。因为在这3个方法中，`self`,`instance`都可以访问

  ![描述符属性](../imgs/python_32_2.JPG)

4.`.__delattr__(self,name)`方法拦截属性的删除
> `delattr(x,'name')`删除了`x.name`属性

5.由于`.__getattribute__(self,name)`方法和`.__setattr__(self,name,value)`方法对所有的属性拦截，因此他们的实现特别要小心，注意不要触发无穷递归。

* `.__getattribute__(self,name)`方法中，若要取属性则可以用超类的`.__getattribute__(self,name)`获取。如果通过`.__dict__`方法获取则会再次触发`.__getattribute__(self,name)`的调用
* `.__setattr__(self,name,value)`方法中，若要设置属性可以用`self.__dict__[name]=value`的方法，或者用超类的`.__setattr__(self,name,value)`方法

  ![__getattribute__与__setattr__陷阱](../imgs/python_32_3.JPG)

6.Python3中，所有使用内置操作隐式的获取方法名属性（如`print(x)`用到了`.__str__(self)`），`.__getattr__(self,name)`、`.__setattr__(self,name,value)`、
`.__getattribute__(self,name)`方法都不会拦截，因为Python在类中查找这样的属性，完全忽略了在实例中查找

  ![__getattribute__与__setattr__陷阱](../imgs/python_32_4.JPG)

7.属性拦截优先级：

* 在读取属性方面，`__getattribute__`优先级最高；在写属性方面，`__setattr__`优先级最高；在删除属性方面，
  `__del__`优先级最高

  ![__getattribute__优先级最高](../imgs/python_32_5.JPG)

* 如果没有`__getattribute__`，`__setattr__`与`__del__`，则读写删属性取决于描述符（`property`也是一种特殊的描述符）。其中如果同一个属性指定了多个描述符，则后面的描述符覆盖前面的描述符
	>因为本质上`property`是一种`descriptor`
  
  ![__getattribute__优先级最高](../imgs/python_32_6.JPG)

* `__getattribute__`与`__getattr__`区别：`__getattribute__`在任何属性读取的时候拦截，而`__getattr__`只有在未定义属性读取的时候拦截（约定俗成地，它要么返回一个值，要么返回`AttributeError`）。其中若二者同时存在则`__getattribute__`优先级较高

   ![__getattribute__与__getattr__区别](../imgs/python_32_7.JPG)
