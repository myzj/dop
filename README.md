# dop
Developer Operations Platform for muyingzhijia 母婴之家
Docs：http://myzj.github.io/dop/
* Developer Operations Platform for muyingzhijia 母婴之家
* Docs：<http://myzj.github.io/dop/>

### 整个项目是基于Django框架来开发，所以在运行项目之前需要先安装python及一些python相关的包

### 下面介绍一下运行项目之前需要安装的一些包及版本

* Python 2.7.12
* Django 1.8.4
* pillow 3.4.2
* MySQL-python 1.2.5
* requests 2.12.4
* pip 9.0.1
> 还有其它的一些需要安装的包，都放在项目的**/dop/dop/requirements.txt**文档中，可以借助pip命令来安装，pip安装示例：
pip install -r requirements.txt


### 相关依赖包安装完成之后，需要配置一下项目运行所依赖的数据库，配置一个可以连接MySQL数据库即可
> 数据配置在项目的/dop/dop/settings.py文件中

	DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # 连接数据的引擎，连接MySQL就不需要修改
        'NAME': 'db_name',  # 数据库名称
        'USER': 'username',  # 数据库用户名
        'PASSWORD': 'password',  # 数据库密码
	        'HOST': '192.168.1.1',  # 数据库主机IP
	        'PORT': 3306,  # 数据库端口号
	    }
	}

### 运行项目
 > 在运行项目之前需要先在数据库中创建对应的表，运用Django框架特性即可创建对应的表
 >> 进入项目manage.py所在的路径依次执行以下命令:
 >>> Python manage.py check (模型及环境检查)  
 >>> python manage.py makemigrations  (创建建表语句)  
 >>> python manage.py migrate  (连接数据库生成对应的表)  
 >>> python manage.py runserver 0.0.0.0:8000  (运行开发服务器)  
 
> 在浏览器中输入项目运行服务器对应的IP加上端口号8000即可进入项目开始界面，如：http://192.168.1.1:8000
