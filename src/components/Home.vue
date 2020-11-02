<template>
  <el-container class="home_container">
      <!-- 头部区域 -->
    <el-header>
        <div>
            <img  src="../assets/timg.jpg"/>
            <span>后台管理系统</span>
        </div>
        <el-button type="primary" plain @click="signout">退出登录</el-button>
    </el-header>
    <!-- 主题区域 -->
    <el-container class="main_container">
      <!-- 左侧区域 -->
      <el-aside width="200px">
            <el-menu background-color="#f7f7f7" text-color="#409EFF" active-text-color="#fe0000" unique-opened router :default-active='statuspath'>
                <!-- 一级菜单 -->
                <el-submenu :index="item.id+ ''" v-for="item in menuList" :key="item.id">
                    <!-- 一级菜单模块 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="icon[item.id]"></i>
                        <!-- 标题 -->
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/'+ items.path+ ''" v-for="items in item.children" :key="items.id" @click="status('/'+ items.path+ '')">
                        <!-- 二级菜单模块 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 标题 -->
                            <span>{{items.authName}}</span>
                        </template>
                    </el-menu-item>
                    
                </el-submenu>

            </el-menu>
        </el-aside>
      <!-- 右侧区域 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data(){
        return{
            //左侧菜单数据
            menuList: [],
            icon: {
                125: 'el-icon-user',
                103: 'el-icon-help',
                101: 'el-icon-goods',
                102: 'el-icon-document',
                145: 'el-icon-pie-chart'
            },
            //点击二级菜单的地址
            statuspath: ''
        }
    },
    created(){
        this.getMenuList()
        this.statuspath = window.sessionStorage.getItem('statuspath')
    },
    methods: {
        signout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        //获取所有的菜单
        async getMenuList(){
            const {data: res} = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
            // console.log(res)
        },
        //二级菜单点击时的状态
        status(statuspath){
            window.sessionStorage.setItem('statuspath',statuspath)
            this.statuspath = statuspath
        }

    }
    
}
</script>

<style lang="less" scoped>
    .home_container{
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        background-color: #f7f7f7;
    }
    .el-header{
        display: flex;
        justify-content:space-between;
        align-items: center;
        font-size: 26px;
        color:  #409EFF;
        font-weight:bold;
        border-bottom: 1px solid #409eff;
        >div{
            display: flex;
            align-items: center;
            span{
                margin-left: 15px;
            }
        }
    }
    .el-header img{
        width: 60px;
        height: 59px;
        // float: left;
        border-radius: 50%;
    }
    .main_container{
        margin-top: 20px;
    }
    .el-main{
        position: relative;
    }
</style>
