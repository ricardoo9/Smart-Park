<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        v-model="params.carNumber"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        v-model="params.personName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option
          v-for="item in StatusList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button
        type="primary"
        class="search-btn"
        @click="doSearch"
      >查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button
        type="primary"
        @click="$router.push('/addCard')"
      >添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list">
        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column
          label="状态"
          prop="cardStatus"
          :formatter="formatStatus"
        />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button
              size="mini"
              type="text"
              @click="editCard(scope.row.id)"
            >编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="this.total"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog title="添加楼宇" width="580px">
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardListAPI } from '@/api/card'
export default {
  data() {
    return {
      list: [], // 获取月卡列表方法
      params: {
        page: 1,
        pageSize: 2,
        carNumber: null,
        personName: null,
        cardStatus: null
      },
      // 月卡状态
      StatusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '有效'
        },
        {
          id: 1,
          name: '已过期'
        }
      ],
      total: 0
    }
  },
  mounted() {
    // 钩子函数内调用
    this.getList()
  },
  methods: {
    // 获取行车月卡方法
    async getList() {
      const res = await getCardListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 格式化状态码方法，三元运算符，也可以对象取值映射
    formatStatus(row, col) {
      return row.cardStatus === 0 ? '有效' : '无效'
    },
    // 获取当前页
    pageChange(page) {
      // 获取当前页
      this.params.page = page
      //   重新加载列表
      this.getList()
    },
    doSearch() {
      // 从第一页开始重新搜索
      this.params.page = 1
      this.getList()
    },
    // 路由跳转传参
    editCard(id) {
      this.$router.push({
        path: '/addCard',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
