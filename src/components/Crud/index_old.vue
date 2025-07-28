<template>
  <div style="padding-top: 14px">
    <!--搜索-->
    <div v-if="!hideSearch" class="search">
      <!--搜索插槽-->
      <slot name="search"> </slot>

      <div style="display: inline-block">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button plain @click="resetSearch">重置</el-button>
      </div>
      <!--      <slot name="export"></slot>-->
    </div>
    <!--crud操作-->
    <div style="margin-bottom: 15px">
      <slot name="crudActionBefore"></slot>
      <el-button
        v-if="!hideAdd"
        v-hasPermi="permissionAdd"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addItem"
        >新增</el-button
      >
      <el-button
        icon="el-icon-delete"
        size="small"
        v-if="selection && multipleDelete"
        v-hasPermi="permissionDelete"
        :disabled="selections.length === 0"
        plain
        @click="deleteMultiple"
        >批量删除</el-button
      >
      <slot name="crudAction"></slot>
      <el-button
        size="small"
        icon="el-icon-download"
        v-if="showExport"
        type="primary"
        plain
        @click="exportDatas"
        >{{ exportName }}</el-button
      >
      <el-button
        size="small"
        icon="el-icon-download"
        v-if="showExport2"
        type="primary"
        plain
        @click="exportDatas2"
        >{{ exportName2 }}</el-button
      >

      <slot name="export"></slot>
    </div>
    <!--    表格与搜索之间的插槽 -->
    <div v-if="useTableLeft" class="table-box">
      <div v-if="useTableLeft" class="table-left">
        <slot name="tableLeft"></slot>
      </div>
      <!--表格-->
      <div class="table-right">
        <div>
          <slot name="insert"></slot>
        </div>
        <el-table
          v-if="!hideTable"
          class="table1"
          :height="tableHeight || null"
          :header-row-style="{
            fontSize: '14px',
            fontFamily: 'PingFangSC-Medium, PingFang SC',
            fontWeight: 500,
            color: ' #333333',
            lineHeight: '22px'
          }"
          v-loading="loading"
          :data="items"
          :row-class-name="tableRowClassName"
          @selection-change="selectionChange"
          max-height="496"
        >
          <el-table-column
            v-if="selection"
            type="selection"
            width="50"
            align="center"
            fixed="left"
          ></el-table-column>
          <el-table-column
            v-if="showOrder"
            :label="order ? '推荐次序' : '序号'"
            width="80"
            align="center"
            fixed="left"
          >
            <template slot-scope="scope">
              {{ scope.$index + 1 + (page - 1) * size }}
            </template>
          </el-table-column>

          <!--表格列插槽-->
          <slot name="table" :data="items"></slot>

          <el-table-column
            v-if="!hideTableAction"
            label="操作"
            :width="actionWidth"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <!--表格操作插槽-->
              <div class="table-action">
                <slot name="tableAction" :data="scope.row"></slot>
                <el-link
                  v-if="!hideEdit"
                  v-hasPermi="permissionEdit"
                  type="primary"
                  @click="editItem(scope.row)"
                  >编辑</el-link
                >
                <el-link
                  v-if="!hideView"
                  type="primary"
                  @click="
                    $router.push({
                      path: viewPath,
                      query: { id: scope.row[idKey] }
                    })
                  "
                  >查看</el-link
                >
                <el-link
                  v-if="!hideDelete"
                  v-hasPermi="permissionDelete"
                  type="danger"
                  @click.native="deleteItem(scope.row)"
                  >删除</el-link
                >
                <el-link
                  v-if="moveUp"
                  type="primary"
                  @click.native="moveUpItem(scope.row, scope.$index)"
                  >上移</el-link
                >
                <el-divider v-if="moveUp" direction="vertical"></el-divider>
                <el-link
                  v-if="moveDown"
                  type="primary"
                  @click.native="moveDownItem(scope.row, scope.$index)"
                  >下移</el-link
                >
                <el-divider v-if="moveDown" direction="vertical"></el-divider>
                <el-link
                  v-if="moveTop"
                  type="primary"
                  @click.native="moveTopItem(scope.row, scope.$index)"
                  >置顶</el-link
                >
                <el-divider v-if="moveTop" direction="vertical"></el-divider>
                <el-link
                  v-if="virtualDelete"
                  type="danger"
                  @click.native="virtualDeleteItem(scope.row, scope.$index)"
                  >移除</el-link
                >
                <slot name="tableActionAfter" :data="scope.row"></slot>
                <!--          <el-button-->
                <!--            v-if="!hideDelete"-->
                <!--            type="text"-->
                <!--            :loading="loading"-->
                <!--            @click="deleteItem(scope.row)"-->
                <!--            >删除</el-button-->
                <!--          >-->
                <slot name="tableDelete" :data="scope.row"></slot>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--自定义数据插槽-->
        <slot name="data" :data="items"></slot>

        <!--分页-->
        <div style="text-align: right">
          <el-pagination
            v-if="!hidePagination"
            style="margin-top: 15px"
            background
            :current-page.sync="page"
            :page-sizes="sizes"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div>
        <slot name="insert"></slot>
      </div>
      <el-table
        v-if="!hideTable"
        class="table1"
        :height="tableHeight || null"
        :header-row-style="{
          fontSize: '14px',
          fontFamily: 'PingFangSC-Medium, PingFang SC',
          fontWeight: 500,
          color: ' #333333',
          lineHeight: '22px'
        }"
        v-loading="loading"
        :data="items"
        :row-class-name="tableRowClassName"
        @selection-change="selectionChange"
        max-height="496"
      >
        <el-table-column
          v-if="selection"
          type="selection"
          width="50"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column
          v-if="showOrder"
          :label="order ? '推荐次序' : '序号'"
          width="80"
          align="center"
          fixed="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 + (page - 1) * size }}
          </template>
        </el-table-column>

        <!--表格列插槽-->
        <slot name="table" :data="items"></slot>

        <el-table-column
          v-if="!hideTableAction"
          label="操作"
          :width="actionWidth"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <!--表格操作插槽-->
            <div class="table-action">
              <slot name="tableAction" :data="scope.row"></slot>
              <el-link
                v-if="!hideEdit"
                v-hasPermi="permissionEdit"
                type="primary"
                @click="editItem(scope.row)"
                >编辑</el-link
              >
              <el-link
                v-if="!hideView"
                type="primary"
                @click="
                  $router.push({
                    path: viewPath,
                    query: { id: scope.row[idKey] }
                  })
                "
                >{{ detailText || "查看" }}</el-link
              >
              <el-link
                v-if="!hideDelete"
                v-hasPermi="permissionDelete"
                type="danger"
                @click.native="deleteItem(scope.row)"
                >删除</el-link
              >
              <el-link
                v-if="moveUp"
                type="primary"
                @click.native="moveUpItem(scope.row, scope.$index)"
                >上移</el-link
              >
              <el-divider v-if="moveUp" direction="vertical"></el-divider>
              <el-link
                v-if="moveDown"
                type="primary"
                @click.native="moveDownItem(scope.row, scope.$index)"
                >下移</el-link
              >
              <el-divider v-if="moveDown" direction="vertical"></el-divider>
              <el-link
                v-if="moveTop"
                type="primary"
                @click.native="moveTopItem(scope.row, scope.$index)"
                >置顶</el-link
              >
              <el-divider v-if="moveTop" direction="vertical"></el-divider>
              <el-link
                v-if="virtualDelete"
                type="danger"
                @click.native="virtualDeleteItem(scope.row, scope.$index)"
                >移除</el-link
              >
              <slot name="tableActionAfter" :data="scope.row"></slot>
              <!--          <el-button-->
              <!--            v-if="!hideDelete"-->
              <!--            type="text"-->
              <!--            :loading="loading"-->
              <!--            @click="deleteItem(scope.row)"-->
              <!--            >删除</el-button-->
              <!--          >-->
              <slot name="tableDelete" :data="scope.row"></slot>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--自定义数据插槽-->
      <slot name="data" :data="items"></slot>

      <!--分页-->
      <div style="text-align: right">
        <el-pagination
          v-if="!hidePagination"
          style="margin-top: 15px"
          background
          :current-page.sync="page"
          :page-sizes="sizes"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <!--弹窗-->
    <div v-if="dialogDestroyOnClose ? dialog : true">
      <el-dialog
        :visible.sync="dialog"
        :width="dialogWidth"
        :title="`${modeText}${title}`"
        :close-on-click-modal="closeOnClickModal"
      >
        <div>
          <el-form
            ref="form"
            :model="form"
            :rules="rule"
            :label-width="labelWidth"
          >
            <!--表单插槽-->
            <slot name="form"></slot>
          </el-form>
        </div>
        <div v-if="!hideDialogAction" slot="footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button
            v-if="!hideSave"
            type="primary"
            :loading="loading"
            @click="saveItem"
            >确定</el-button
          >
          <!--表单操作插槽-->
          <slot name="dialogAction"></slot>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import rule from "@/mixins/rule";
import _ from "lodash";
import { downloadFile } from "@/utils/data";

export default {
  mixins: [rule],
  props: {
    // 表单对象
    form: {
      type: Object,
      default: () => ({})
    },
    // 搜索对象
    query: {
      type: Object,
      default: () => ({})
    },
    // 弹窗标题
    title: {
      type: String,
      default: ""
    },
    // 表格高度
    tableHeight: {
      type: String,
      default: ""
    },
    // 表格是否开启多选模式
    selection: {
      type: Boolean,
      default: false
    },
    // 获取数据方法
    getMethod: {
      type: Function
    },
    // 自定义获取数据方法（无分页等）
    customGetMethod: {
      type: Function
    },
    // 新增数据方法
    addMethod: {
      type: Function
    },
    // 编辑数据方法
    updateMethod: {
      type: Function
    },
    // 删除数据方法
    deleteMethod: {
      type: Function
    },
    // 导出数据方法
    exportMethod: {
      type: Function
    },
    // 导出数据方法2
    exportMethod2: {
      type: Function
    },
    exportName: {
      type: String,
      default: "导出"
    },
    exportFileName: {
      type: String,
      default: "导出文件"
    },
    exportFileName2: {
      type: String,
      default: "导出文件"
    },
    exportName2: {
      type: String,
      default: "导出"
    },
    // 获取数据后方法（items重新赋值等处理）
    afterGetMethod: {
      type: Function
    },
    // 编辑前方法（将item需要提交的值赋到form，父组件必须操作）
    beforeEditMethod: {
      type: Function
    },
    // 提交前方法，返回新的data值
    beforeSaveMethod: {
      type: Function
    },
    // 删除前方法，返回新的data值
    beforeDeleteMethod: {
      type: Function
    },
    // 提交数据方法
    submitSortMethod: {
      type: Function
    },
    // 数据id key
    idKey: {
      type: String,
      required: true
    },
    // 新增权限
    permissionAdd: {
      type: [Array, Number, String]
    },
    // 编辑权限
    permissionEdit: {
      type: [Array, Number, String]
    },
    // 删除权限
    permissionDelete: {
      type: [Array, Number, String]
    },
    // 新增页面地址
    addPath: {
      type: String,
      default: ""
    },
    // 编辑页面地址
    editPath: {
      type: String,
      default: ""
    },
    // 查看页面地址
    viewPath: {
      type: String,
      default: ""
    },
    // 隐藏新增按钮
    hideAdd: {
      type: Boolean,
      default: false
    },
    // 导出
    showExport: {
      type: Boolean,
      default: false
    },
    // 导出2
    showExport2: {
      type: Boolean,
      default: false
    },
    // 批量删除
    multipleDelete: {
      type: Boolean,
      default: false
    },
    // 隐藏搜索
    hideSearch: {
      type: Boolean,
      default: false
    },
    // 隐藏分页
    hidePagination: {
      type: Boolean,
      default: false
    },
    // 隐藏表格
    hideTable: {
      type: Boolean,
      default: false
    },
    // 表格左边插槽
    useTableLeft: {
      type: Boolean,
      default: false
    },
    // 隐藏表格操作列
    hideTableAction: {
      type: Boolean,
      default: false
    },
    // 隐藏弹窗操作
    hideDialogAction: {
      type: Boolean,
      default: false
    },
    // 隐藏编辑按钮
    hideEdit: {
      type: Boolean,
      default: false
    },
    // 隐藏查看按钮
    hideView: {
      type: Boolean,
      default: false
    },
    // 隐藏删除按钮
    hideDelete: {
      type: Boolean,
      default: false
    },
    // 虚拟删除按钮
    virtualDelete: {
      type: Boolean,
      default: false
    },
    // 隐藏表单确定按钮
    hideSave: {
      type: Boolean,
      default: false
    },
    // 编辑和删除区域宽度
    actionWidth: {
      type: String,
      default: "140px"
    },
    // 弹窗宽度
    dialogWidth: {
      type: String,
      default: "500px"
    },
    // 是否点击遮罩关闭弹窗
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 弹窗是否关闭后销毁
    dialogDestroyOnClose: {
      type: Boolean,
      default: false
    },
    // 表单label宽度，95容纳5个字
    labelWidth: {
      type: String,
      default: "95px"
    },
    showOrder: {
      default: true,
      type: Boolean
    },
    // 推荐次序
    order: {
      type: Boolean,
      default: false
    },
    // 上移
    moveUp: {
      type: Boolean,
      default: false
    },
    // 下移
    moveDown: {
      type: Boolean,
      default: false
    },
    // 置顶
    moveTop: {
      type: Boolean,
      default: false
    },
    tableRowClassName: {
      type: Function,
      default: () => ""
    },
    // 每页个数
    defaultSize: {
      type: Number,
      default: 10
    },
    // 每页个数
    detailText: {
      type: String,
      default: ""
    },
    // 删除文字
    deleteText: {
      type: String,
      default: "是否删除该条数据？"
    }
  },
  data() {
    return {
      defaultForm: _.cloneDeep(this.form),
      defaultQuery: _.cloneDeep(this.query),
      loading: true,
      dialog: false,
      mode: 0, // 0新增，1编辑
      items: [],
      page: 1,
      size: 10,
      sizes: [10, 20, 50, 100],
      total: 0,
      selections: []
    };
  },
  watch: {
    page() {
      this.getItems();
    },
    dialog(show) {
      if (!show) {
        this.mode = 0;
        if (!this.dialogDestroyOnClose) {
          this.resetForm(); // 防止dom销毁报错
        }
        this.updateForm(_.cloneDeep(this.defaultForm));
        this.$emit("dialogClose");
      }
    }
  },
  computed: {
    modeText() {
      let text = "新增";
      if (this.mode === 0) {
        text = "新增";
      } else if (this.mode === 1) {
        text = "编辑";
      }
      return text;
    }
  },
  beforeMount() {
    this.size = this.defaultSize;
  },
  mounted() {
    this.getItems();
  },
  methods: {
    // 获取数据
    async getItems() {
      const { page, size, query } = this;
      let params = {};
      if (query?.dateRange) {
        // 判断有没有日期范围选择器
        params = {
          pageNum: page,
          pageSize: size,
          ...query,
          receiveStartDate: query.dateRange[0],
          receiveEndDate: query.dateRange[1]
        };
        delete params.dateRange;
      } else {
        params = {
          pageNum: page,
          pageSize: size,
          ...query
        };
      }
      this.loading = true;
      try {
        if (this.customGetMethod) {
          this.items = await this.customGetMethod({ ...query });
        } else {
          const res = await this.getMethod(params);
          this.items = res.rows;
          this.total = res.total;
        }
        this.loading = false;
        this.afterGetMethod && this.afterGetMethod();
        this.$emit("changeData");
      } finally {
        this.loading = false;
      }
    },
    // 搜索
    search() {
      this.page = 1;
      this.getItems();
    },
    // 搜索重置
    resetSearch() {
      this.updateQuery(_.cloneDeep(this.defaultQuery));
      // 用户$nextTick等待query从父组件同步过来
      this.$nextTick(() => {
        this.page = 1;
        this.getItems();
      });
      this.$emit("resetForm");
    },
    // 打开弹窗
    openDialog() {
      this.dialog = true;
    },
    // 关闭弹窗
    closeDialog() {
      this.dialog = false;
    },
    // 新增
    addItem() {
      if (this.addPath) {
        this.$router.push(this.addPath);
      } else {
        this.updateForm(_.cloneDeep(this.defaultForm));
        this.openDialog();
        this.mode = 0;
      }
    },
    // 编辑
    editItem(item) {
      if (this.editPath) {
        this.$router.push({
          path: editPath,
          query: { id: item[this.idKey] }
        });
      } else {
        if (!this.beforeEditMethod) {
          console.error("请传入 beforeEditMethod 处理数据回填");
          return;
        }
        this.beforeEditMethod(item);
        this.openDialog();
        this.mode = 1;
      }
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },
    // 删除
    async deleteItem(item) {
      this.$confirm(this.deleteText, "提示", {
        type: "warning"
      }).then(async () => {
        this.loading = true;
        try {
          let data = [item[this.idKey]];
          if (this.beforeDeleteMethod) {
            data = this.beforeDeleteMethod(item);
          }
          await this.deleteMethod(data);
          this.$notify.success("删除成功");
          await this.getItems();
        } finally {
          this.loading = false;
        }
      });
    },
    // 虚拟删除
    async virtualDeleteItem(item, index) {
      this.$confirm("是否移除该条数据？", "提示", {
        type: "warning"
      }).then(async () => {
        //console.log(item, index);
        this.items.splice(index, 1);
        // this.loading = true;
        // try {
        //   let data = [item[this.idKey]];
        //   if (this.beforeDeleteMethod) {
        //     data = this.beforeDeleteMethod(item);
        //   }
        //   await this.deleteMethod(data);
        //   this.$notify.success("删除成功");
        //   await this.getItems();
        // } finally {
        //   this.loading = false;
        // }
      });
    },
    // 导出
    async exportDatas() {
      if (this.selections.length === 0) {
        this.$notify.error("请选择需要导出的数据");
        return;
      }
      this.$confirm("是否批量导出所选数据？", "提示", {
        type: "warning"
      }).then(async () => {
        this.loading = true;
        const { page, size, query } = this;
        try {
          const data = {
            ...query,
            pageNum: page,
            pageSize: size,
            ids: this.selections.map(item => item[this.idKey])
          };
          const res = await this.exportMethod(data);
          downloadFile(res, this.exportFileName);
          // this.$notify.success('导出成功');
        } finally {
          this.loading = false;
        }
      });
    },
    // 导出2
    async exportDatas2() {
      if (this.selections.length === 0) {
        this.$notify.error("请选择需要导出的数据");
        return;
      }
      this.$confirm("是否批量导出所选数据？", "提示", {
        type: "warning"
      }).then(async () => {
        this.loading = true;
        const { page, size, query } = this;
        try {
          const data = {
            ...query,
            pageNum: page,
            pageSize: size,
            ids: this.selections.map(item => item[this.idKey])
          };
          const res = await this.exportMethod2(data);
          downloadFile(res, "浙江省未来乡村申报汇总");
          downloadFile(res, this.exportFileName2);
          // this.$notify.success('导出成功');
        } finally {
          this.loading = false;
        }
      });
    },
    // 批量删除
    async deleteMultiple() {
      this.$confirm("是否批量删除所选数据？", "提示", {
        type: "warning"
      }).then(async () => {
        this.loading = true;
        try {
          let data = this.selections.map(item => item[this.idKey]);
          await this.deleteMethod(data);
          this.$notify.success("删除成功");
          await this.getItems();
        } finally {
          this.loading = false;
        }
      });
    },
    // 上移
    moveUpItem(data, index) {
      //console.log(data, index);
      if (index !== 0) {
        this.items.splice(index, 1);
        this.items.splice(index - 1, 0, data);
      }

      // console.log(this.form.detail);
    },
    // 下移
    moveDownItem(data, index) {
      // if (index !== )
      this.items.splice(index, 1);
      this.items.splice(index + 1, 0, data);
    },
    // 置顶
    moveTopItem(data, index) {
      this.items.splice(index, 1);
      this.items.splice(0, 0, data);
    },
    // 提交排序
    async submitSort() {
      const { items } = this;
      const data = items.map((item, index) => {
        return {
          id: item.id,
          citySortNum: index + 1 // 加排序序号 从0开始
        };
      });
      this.loading = true;
      try {
        await this.submitSortMethod(data);
        this.$emit("submitSuccess");
        this.$message({
          message: "提交成功！",
          type: "success"
        });
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    // 保存
    async saveItem() {
      //console.log("点击了");
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            let data = this.form;
            if (this.beforeSaveMethod) {
              data = this.beforeSaveMethod();
            }
            if (this.mode === 0) {
              await this.addMethod(data);
            } else if (this.mode === 1) {
              await this.updateMethod(data);
            }
            this.$notify.success(`${this.modeText}成功`);
            this.closeDialog();
            this.resetForm();
            await this.getItems();
          } finally {
            this.loading = false;
          }
        }
      });
    },
    // 分页大小切换
    handleSizeChange(val) {
      this.page = 1;
      this.size = val;
      this.getItems();
    },
    // 表格多选回调
    selectionChange(val) {
      this.selections = val;
      this.$emit("selectionChange", val);
    },
    // 同步form到父组件
    updateForm(form) {
      this.$emit("update:form", form);
    },
    // 同步query到父组件
    updateQuery(query) {
      this.$emit("update:query", query);
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  box-sizing: border-box;
  margin-bottom: 10px;
  > * {
    margin-right: 15px;
    margin-bottom: 5px;
  }
}
.table-box {
  width: 100%;
  display: flex;
  .table-right {
    flex: 1;
  }
}
.table1 {
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.05);
  ::v-deep tr th {
    background-color: #f3f3f3;
    color: #222;
  }
}
.table-action {
  > * {
    margin: 0 4px;
  }
}
</style>
