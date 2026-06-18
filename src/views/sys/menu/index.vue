<template>
  <div>
    <el-form :model="queryParam" inline size="small">
      <el-form-item label="菜单标题">
        <el-input v-model="queryParam.title"/>
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input v-model="queryParam.permission"/>
      </el-form-item>
      <el-form-item label="组件路径">
        <el-input v-model="queryParam.component"/>
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-select v-model="queryParam.type" placeholder="">
          <el-option
            v-for="item in menuTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="query" size="small">查询</el-button>
      <el-button size="small">重置</el-button>
    </el-form>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="create">新增</el-button>
      <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
    </el-row>
    <el-table :data="page.content"
              size="small"
              row-key="id"
              lazy
              :load="load"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="selection"/>
      <el-table-column property="title" label="菜单标题"/>
      <el-table-column property="sort" label="排序"/>
      <el-table-column property="permission" label="所需权限"/>
      <el-table-column property="component" label="组件路径"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible">
      <el-form size="small">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type">
            <el-radio-button
              v-for="item in menuTypeOptions"
              :label="item.value"
            >{{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.type === 'CATALOG'">
          <el-form-item label="菜单标题">
            <el-input v-model="form.title"/>
          </el-form-item>
        </template>
        <template v-if="form.type === 'MENU'">
          <el-form-item label="目录标题">
            <el-input v-model="form.title"/>
          </el-form-item>
        </template>
        <template v-if="form.type === 'BUTTON'">
          <el-form-item label="按钮标题">
            <el-input v-model="form.title"/>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import menuApi from '@/api/sys/menu'
import enumApi from '@/api/sys/enum'

export default {
  name: 'Menu',
  created() {
    this.query()
    enumApi.findByName('SysMenuType').then((res) => {
      this.menuTypeOptions = res
    })
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        type: 'CATALOG',
      },
      page: {
        content: []
      },
      menuTypeOptions: [],
      queryParam: {
        parentId: null,
        title: '',
        permission: '',
        component: '',
        type: '',
        sort: [
          'id,asc',
          'sort,desc'
        ]
      }
    }
  },
  methods: {
    create() {
      this.dialogVisible = true;
    },
    load(row, treeNode, resolve) {
      this.queryParam.parentId = row.id
      menuApi.query(this.queryParam).then((res) => {
        console.log('load res.content', res.content)
        resolve(res.content)
      })
    },
    query() {
      menuApi.query(this.queryParam).then((res) => {
        this.page = res
        this.page.content = this.flatToTree(this.page.content)
        console.log(this.page.content)
      })
    },
    flatToTree(flatList) {
      if (!flatList) {
        return null
      }
      const treeData = []
      const map = new Map()
      flatList.forEach(item => {
        map.set(item.id, item)
      })
      flatList.forEach(item => {
        if (item.parentId && map.has(item.parentId)) {
          const parent = map.get(item.parentId)
          parent.children = parent.children || []
          debugger
          parent.children.push(item)
        } else {
          debugger
          treeData.push(item)
        }
      })
      return treeData
    }
  }
}
</script>

<style scoped>
</style>
