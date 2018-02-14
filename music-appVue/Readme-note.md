# 初始化 vue init webpack <name>
# 选择runtime-only
# 按装router eslint(standard) 
# 无需安装测试
# babel-runtime  转译es6语法
# babel-polyfill ES6 API语法
# fastclick 解决移动端延迟300ms
# tag="div" 属性决定渲染后的标签
- encodeURIComponent(value) 编译URl

# new Array(n) 新建一个数组长度为n
-  <keep-alive>
      <router-view/>
    </keep-alive>  【路由包裹次标签可以保持缓存不用重新刷新】

# loading: require('common/img/default.png') 【文件加载格式】
# better 限时~只对第一个子元素实现滚动，父元素的高度固定，需要子元素撑开

- charCodeAt() 方法可返回指定位置的字符的 Unicode 编码

- e.touches [获取触摸点]
# touch时间的 client 和 page 区别在于滚动条是否包含在内

# import * as types 未见用法~

# 数据有特殊字符的话文本绑定可以用v-html
#  $el是针对组件的根元素
# ：id路由配置
# 组件在外部可以通过 $refs.el.xxxx调用

# transform 的class会动态的加入到根目录中
# router-link-active 会动态加入到router-link中

# @click.stop 阻止冒泡