<template>
  <div class="navbar">
    <div class="navbar-left">
      <img
        v-if="logo"
        :src="logo"
        class="nav-logo"
      />
      <div>{{ title }}</div>
      <el-menu
        mode="horizontal"
        class="menu"
        text-color="#fff"
        active-text-color="#fff"
        background-color="#282f33"
        border-color="#03baca"
        router
        :default-active="activeMenu"
      >
        <template v-for="(route, index) in sidebarRouters">
          <!-- 没有子路由 -->
          <el-menu-item
            v-if="(!route.hidden && !route.children)"
            :index="route.path"
          >{{ route.meta ? route.meta.title: '' }}</el-menu-item>
          <el-menu-item
            v-if="!route.hidden && route.children && getChildrenAll(route.children).flag"
            :index="route.path + '/' + getChildrenAll(route.children).path"
          >{{ route.meta ? route.meta.title: '' }}</el-menu-item>
          <!-- 只有一个子路由 -->
          <el-menu-item
            v-if="!route.hidden && route.children  && !getChildrenAll(route.children).flag &&  route.children.length === 1"
            :index="route.children[0].path"
          >{{ route.children[0].meta ? route.children[0].meta.title: '' }}</el-menu-item>
          <!-- 有超过一个的子路由 -->
          <el-submenu
            v-if="!route.hidden && route.children && !getChildrenAll(route.children).flag && route.children.length > 1"
            :index="route.path"
          >
            <template slot="title">{{route.meta ? route.meta.title: ''}}</template>
            <template v-for="(sroute, sindex) in route.children">
              <el-menu-item
                v-if="!sroute.hidden && !sroute.children"
                :index="route.path + '/' + sroute.path"
              >{{ sroute.meta ? sroute.meta.title: '' }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <!-- <sidebar-item

          :key="route.path  + index"
          :item="route"
          :base-path="route.path"
        /> -->
      </el-menu>
    </div>
    <div class="right-menu">
      <div class="right-menu-item">
        <notice></notice>
      </div>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="avatar"
            class="user-avatar"
          >
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item
            divided
            @click.native="logout"
          >
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import logoImg from '@/assets/logo/logo.png';
import Notice from './Notice/index.vue';
import SidebarItem from './Sidebar/SidebarItem';
export default {
  computed: {
    ...mapGetters(['sidebarRouters', 'sidebar', 'avatar', 'device', 'name']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
    activeMenu() {
      const route = this.$route;
      this.$emit('handleFullPath', this.$route.fullPath);
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
  components: {
    Notice,
    SidebarItem,
  },
  data() {
    return {
      logo: logoImg,
      title: process.env.VUE_APP_TITLE,
    };
  },
  mounted() {
    console.log('sidebarRouters', this.sidebarRouters)
  },
  methods: {
    // 判断子路由是否全部隐藏
    getChildrenAll(arr = []) {
      let flag = arr.every((el) => el.hidden);
      return {
        flag,
        path: arr[0].path,
      };
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index';
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

.navbar {
  min-width: 1200px;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: $sys-bg;
  padding: 0 25px 0 12px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  .navbar-left {
    height: 100%;
    display: flex;
    align-items: center;
    .nav-logo {
      height: 22px;
      margin-right: 10px;
    }
    .menu {
      margin-left: 30px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        color: #fff;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .name {
          font-weight: 400;
          font-size: 15px;
          color: #ffffff;
          margin-right: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
