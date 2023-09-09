<!--
    作者：华校专
    email: huaxz1986@163.com
**  本文档可用于个人学习目的，不得用于商业目的  **
-->
# 元类
1.元类是一种特殊的类，它用于创建类。元类机制允许我们在一条`class`语句的末尾自动插入某些逻辑。它在类对象创建时运行，是管理和扩展类的钩子。元类不是管理类的实例，而是管理类本身

2.尽管类的装饰器通常用来管理或者扩展类实例，但是他们也可以用于管理和扩展类对象本身，也与元类的功能重叠

3.Python3中，所有用户定义的类都是`type`类对象的实例，`type`类是应用最广的元类

4.`class`语句的内部机制：在一条`class`语句的末尾，Python会调用`type`类的构造函数来创建一个`class`对象。

```
MyClass=type(classname,superclasses,attributedict) #新建了一个类，类名叫MyClass
# classname:类名，会成为MyClass类的 .__name__属性
# superclasses:类的超类元组，会成为MyClass类的 .__bases__属性
# attributedict:类的命名空间字典，会成为MyClass类的 .__dict__ 属性
# 这个语句也是动态创建类对象的方法
```

* `type`类定义了一个`.__call__(...)`方法。该方法运行`type`类定义的两个其他方法：
	* `.__new__(mclass,classname,superclasses,attributedict)`方法，它返回新建的`MyClass`类
		> `mclass`：为本元类，这里是`type`类  
		> `classname`：为被创建的类的类名，这里是`'MyClass'`  
		> `superclasses`：为被创建的类的超类元组  
		> `attributedict`：为被创建的类的名字空间字典  
	* `.__init__(customclass,classname,superclasses,attributedict)`方法，
	  它初始化新建的`MyClass`类
		> `customclass`：为被创建的类，这里是`MyClass`类  
		> `classname`：为被创建的类的类名，这里是`'MyClass'`  
		> `superclasses`：为被创建的类的超类元组  
		> `attributedict`：为被创建的类的名字空间字典  

5.所有的类型均由`type`类创建。要通知Python用一个定制的元类来创建类，可以直接声明一个元类来拦截常规的类创建过程。

定义元类：（所有元类必须是`type`的子类）

```
class MetaClass(type):
	def __new__(mclass,classname,superclasses,attributedict):		
		return type.__new__(mclass,classname,superclasses,attributedict)
	def __init__(customclass,classname,superclasses,attributedict):
		return type.__init__(customclass,classname,superclasses,attributedict)
```
使用元类：

```
class MyClass(metaclass=MetaClass):
	pass
```

* 继承的超类也列在括号中，但是要在元类之前，也用逗号分隔：
  `class MyClass(BaseCls1,BaseCls2,metaclass=MetaClass)`
* 使用元类声明后，在`class`语句底部进行创建`MyClass`类时，改为调用元类`MetaClass`而不是默认的`type`：
  `MyClass=Meta('MyClass`,superclasses,attributedict)`
* 元类`MetaClass`要实现元类协议：
	* 重载元类的`.__new__(Meta,classname,superclasses,attributedict)`方法，它返回新建的`MyClass`类
	* 重载元类的`.__init__(customclass,classname,superclasses,attributedict)`方法，
	  它初始化新建的`MyClass`类
	>`type`类的`.__call__(...)`方法将创建和初始化`MyClass`类对象的调用委托给元类MetaClass`

  ![元类](../imgs/python_34_1.JPG)

6.元类有的时候不一定是个真正的类，它也可能是一个函数。任何可调用对象都可以作为一个元类，只需要按照以下的做法：

```
def MetaFactory(classname,superclasses,attributedict):
	...
	return type(classname,superclasses,attributedict) #动态创建类型
class A(metaclass=MetaFactory):
	pass
```

* 在`class`语句的末尾会调用`MetaFactory`函数

  ![函数做元类](../imgs/python_34_2.JPG)

7.事实上元类只用于创建类对象，元类并不产生元类自己的实例。因此元类的名字查找规则有些不同：`.__call__`，`.__new__`，`.__init__`方法均在类中查找

8.元类的继承：

* 元类声明由子类继承，即子类的构建也是由父类的元类负责

  ![元类的继承](../imgs/python_34_3.JPG)

* 如果元类是以函数的方式声明，则子类的构建不再继承这个函数式元类

  ![元类的继承](../imgs/python_34_4.JPG)

* 元类中的属性并不进入自定义类的命名空间，即元类中声明的一些类属性与被创建类的名字空间无关（他们是两个不同的类）

  ![元类和被创建类的属性](../imgs/python_34_5.JPG)

* 自定义的类，如果没有显示指定元类，也没有指定父类，则默认使用`type`作为元类（即常规的类创建机制）