<!--
    作者：华校专
    email: huaxz1986@163.com
**  本文档可用于个人学习目的，不得用于商业目的  **
-->
# 装饰器
1.装饰器是用于包装其他可调用对象的一个可调用对象，<font color='red'>它是一个可调用对象，其调用参数为另一个可调用对象<，它返回一个可调用对象</font>

* 一个函数对象是可调用对象。
* 一个类对象是可调用对象，对它调用的结果就是返回类的实例
* 实现了`.__call__()`方法的类，其实例对象是可调用对象，对它调用的结果就是调用`.__call__()`方法

  ![可调用对象](../imgs/python_33_1.JPG)

装饰器有两种使用形式：

* 函数的装饰器：在函数对象定义的时候使用装饰器，用于管理该函数对象
* 类的装饰器：在类定义的时候使用该装饰器，用于管理该类以及类的实例

>装饰器是装饰器模式的一个实现

2.函数的装饰器：用于管理函数。函数的装饰器声明为：

```
@decorator
def func(*pargs,**kwargs):
	pass
```
即在正常的函数定义之前冠以`@decorator`说明符（即装饰器声明）。它等价于：

```
def func(*pargs,**kwargs):
	pass
func=decorator(func)
```

* 类中的`@staticmethod`、`@classmethod`、`@property`均为装饰器
* 执行了装饰器的`def`之后，函数名指向的不再是原来的函数对象，而是：
	* 一个可调用对象， 当`decorator`是个函数时由`decorator(func)`函数返回的
	* `decorator`类的实例，当`decorator`是个类时，由`decorator(func)`构造方法返回

  ![函数的装饰器](../imgs/python_33_2.JPG)

3.类的装饰器：用于管理类。类的装饰器声明为：

```
@decorator
class A:
	pass
```
即在正常的类定义之前冠以`@decorator`说明符（即装饰器声明）。它等价于：

```
class A:
	pass
A=decorator(A)
```

* 类的装饰器并不是拦截创建实例的函数调用，而是返回一个不同的可调用对象
* 执行了装饰器的`class`之后，类名指向的不再是原来的类对象，而是：
	* 一个可调用对象， 当`decorator`是个函数时由`decorator(func)`函数返回的
	* `decorator`类的实例，当`decorator`是个类时，由`decorator(func)`构造方法返回

  ![类的装饰器](../imgs/python_33_3.JPG)

3.装饰器只是一个返回可调用对象的可调用对象，它没有什么特殊的地方。

* 可以用函数实现装饰器：

```
def decorator(func): #定义了一个叫decorator的装饰器
	#某些处理
	return func #返回可调用对象
```

* 也可以用类来实现装饰器：

```
class decorator:
	def __init__(self,func):
		self.func=func
	def __call__(self,*args,**kwargs):
		return self.func
```

* 通常用嵌套类来实现装饰器：

```
def decorator(func): #定义了一个叫decorator的装饰器
	def wrapper(*args):
		#使用func或其他的一些工作
	return wrapper #返回可调用对象
```

  ![三种装饰器的实现](../imgs/python_33_4.JPG)

4.装饰器的嵌套：

* 函数的装饰器的嵌套：

```
@decoratorA
@decoratorB
@decoratorC
def func():
	pass
```
等价于

```
def f():
	pass
f=A(B(C(f)))
```
* 类的装饰器的嵌套：

```
@decoratorA
@decoratorB
@decoratorC
class M:
	pass
```
等价于

```
class M:
	pass
M=A(B(C(M)))
```
>每个装饰器处理前一个装饰器返回的结果，并返回一个可调用对象

5.装饰器可以携带参数。

* 函数定义的装饰器带参数：它其实是一个嵌套函数。
	* 外层函数的参数为装饰器参数，返回一个函数（内层函数）
	* 内层函数的参数为`func`，返回一个可调用参数，<font color='red'>内层函数才是真正的装饰器</font>

```
def decorator(*args,**kwargs): 
	print("this is decorator1:",args,kwargs)
	def actualDecorator(func): # 这才是真实的装饰器
		...
		return func
	return actualDecorator
```

  ![带参数的函数定义的装饰器](../imgs/python_33_5.JPG)

* 类定义的装饰器带参数：它其实是一个嵌套类。
	* 外层类的初始化函数的参数为装饰器参数，外层类的`__call__`函数的参数为`func`，返回值为一个类的实例（内部类实例）
	* 内层类的初始化函数参数为`func`；内层类的`__call__`函数使用`func`，<font color='red'>内层类才是真正的装饰器</font>

```
class decorator2:
	class ActualDecorator: #这才是真实的装饰器
		def __init__(self,func):
			...
			self.func=func#记住func
		def __call__(self,*args,**kwargs):
			...
			return self.func(*args,**kwargs) #使用func
	def __init__(self,*args,**kwargs):
		...
	def __call__(self,func):
		...
		return decorator2.ActualDecorator(func)
```

  ![带参数的函数定义的装饰器](../imgs/python_33_6.JPG) 

总结：

* 不带参数的装饰器`decorator`装饰一个名字`F`（可能为函数名、也可能为类名）`@decorator`：则执行的是：`F=decorator(F)`，直接使用`F`
* 带参数的装饰器`decorator`装饰一个名字`F`（可能为函数名、也可能为类名）`@decorator(args)`：则执行的是：`F=decorator(args)(F)`，间接使用`F`

6.利用装饰器可以实现单例模式：

```
def Singleton(cls):
	instance=None
	def onCall(*args,**kwargs):
		nonlocal instance
		if instance == None:
			instance=cls(*args,**kwargs)
		return instance
	return onCall
@Singleton
class A:
	pass
```
  ![利用装饰器实现单例模式](../imgs/python_33_7.JPG) 

7.利用装饰器可以跟踪对象的调用接口，从而管理对实例的接口访问（如统计调用次数，打印调用日志）

```
def Tracer(cls):
	class  Wrapper:
		def __init__(self,*args,**kwargs):
			self.wrapped=cls(*args,**kwargs)
		def __getattr__(self,name):
			print('Trace:'+name)
			return getattr(self.wrapped,name)
	return Wrapper
@Tracer
class A:
	pass
```

  ![利用装饰器跟踪对象接口](../imgs/python_33_8.JPG) 

8.装饰器也可以直接管理函数和类，而不仅仅只是管理对他们的调用

* 利用装饰器添加函数和类到注册表：

```
register_dict={}
def register(obj):
	register_dict[obj.__name__]=obj
	return obj
@register
def func():
	pass
```

  ![利用装饰器添加函数到注册表](../imgs/python_33_9.JPG) 

* 利用装饰器为函数和类添加属性

```
def register(obj):
	obj.label=0
	return obj
@register
def func():
	pass
```

  ![利用装饰器为函数添加属性](../imgs/python_33_10.JPG) 








  