<template>
  <div class="home">
    <el-container>
      <el-aside style="width: auto">
        <el-menu
          :default-active="$route.path"
          background-color="#444f59"
          text-color="#eee"
          active-text-color="#2d8cf0"
          style="height: 100%; border: none"
          router
          :collapse="isCollapse"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="String(index)"
            v-for="(item, index) in menuslist"
            :key="index"
            :disabled="!item.use"
          >
            <template slot="title">
              <i :class="icons[index]"></i>
              <span>{{ item.pathName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="String(menu.path)"
              v-for="menu in item.children"
              :key="menu.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ menu.pathName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <i
              class="el-icon-s-fold icon"
              @click="isCollapse = !isCollapse"
            ></i>
            <span class="title">Elearing后台管理系统</span>
          </div>
          <div class="dropdown">
            <el-dropdown @command="dropdownCommand">
              <img src="../assets/images/favicon.png" class="portrait" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="quit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <nav style="margin-bottom: 20px">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home/advertising' }"
                >首页</el-breadcrumb-item
              >
              <el-breadcrumb-item
                v-for="(item, index) in this.$route.meta"
                :key="index"
                >{{ item }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </nav>

          <keep-alive :exclude="['GoodsDetail', 'SuitDetail', 'GoodsCarousel']">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  created() {
    // let loginAdmin = JSON.parse(window.localStorage.getItem('loginAdmin'));//读取 字符串转换成对象才能使用
    // console.log(loginAdmin);
    // if(loginAdmin.grade!=1){
    //     for(let i=0;i<this.menuslist.length;i++){
    //         if(this.menuslist[i].pathName == "优惠系统" || this.menuslist[i].pathName == "退款管理"){
    //             this.menuslist[i].use = false;
    //         }
    //     }
    // }
  },
  data() {
    return {
      menuslist: [
        {
          pathName: "首页",
          children: [{ pathName: "课程管理", path: "/course/manage" }, {pathName: "轮播图", path: "/course/carousel"}],
          use: true,
        },
        {
          pathName: "用户",
          children: [{ pathName: "用户管理", path: "/user/manage" }],
          use: true,
        },
      ],
      icons: ["el-icon-s-home", "el-icon-user"],
      isCollapse: false,
    };
  },
  methods: {
    dropdownCommand(command) {
      if (command == "quit") {
        this.$message.success("退出成功");
        this.$router.push("/login");
      } else if (command == "home") this.$router.push("/course/manage");
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      height: 100%;
      background: #444f59;
    }
    .el-main {
      height: 100%;
      background: #f0f5f9;
    }
  }
}

.header {
  background: #3e4149;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px !important;

  .icon {
    color: #eee;
    font-size: 19px;
    cursor: pointer;
  }

  .title {
    font-size: 18px;
    color: #eee;
    margin-left: 10px;
  }

  .dropdown {
    margin-right: 20px;

    .portrait {
      height: 30px;
      width: 30px;
      border-radius: 100%;
      margin-right: 50%;
    }
  }
}

.el-breadcrumb {
  font-size: 13px;
}
</style>
