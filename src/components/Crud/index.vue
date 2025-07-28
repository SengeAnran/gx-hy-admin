<template>
  <div style="padding-top: 14px">
    <!--搜索-->
<!--    inline-flex-->
    <div v-if="!hideSearch" class="search  pl-0">
      <!--搜索插槽-->
      <slot name="search"></slot>

      <div class="search-btns">
        <el-button icon="el-icon-search" type="primary" size="mini" @click="search">查询</el-button>
        <el-button icon="el-icon-refresh" type="info" size="mini"  @click="resetSearch">重置</el-button>
      </div>
      <!--      <slot name="export"></slot>-->
    </div>
    <!--crud操作-->
    <div style="margin-bottom: 15px">
      <slot name="crudActionBefore"></slot>
      <!--       v-hasPermi="permissionAdd"-->
      <el-button
          v-if="!hideAdd"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="addItem"
      >{{ addText }}
      </el-button
      >
      <!--         v-hasPermi="permissionDelete"-->
      <el-button
          icon="el-icon-delete"
          v-if="selection && multipleDelete"
          size="mini"
          type="danger"
          :disabled="selections.length === 0"
          plain
          @click="deleteMultiple"
      >{{deleteBtnText}}
      </el-button
      >
      <slot name="crudAction"></slot>
      <el-button icon="el-icon-download" v-if="showExport" type="primary" plain @click="exportDatas">{{
          exportName
        }}
      </el-button>
      <el-button icon="el-icon-download" v-if="showExport2" type="primary" plain @click="exportDatas2">{{
          exportName2
        }}
      </el-button>

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
            ref="multipleTable"
            :height="tableHeight || null"
            :header-row-style="{
            fontSize: '14px',
            fontFamily: 'PingFangSC-Medium, PingFang SC',
            fontWeight: 500,
            color: ' #333333',
            lineHeight: '22px',
          }"
            v-loading="loading"
            :data="items"
            :row-class-name="tableRowClassName"
            @select="handleSelectChange"
            @selection-change="selectionChange"
            @select-all="selectAll"
            @row-click="rowClick"

        >
          <!--          max-height="496"-->
          <el-table-column
              v-if="selection"
              :selectable="selectable"
              type="selection"
              width="50"
              align="center"
              fixed="left"
          ></el-table-column>
          <el-table-column v-if="showOrder" :label="order ? '推荐次序' : '序号'" width="80" align="center" fixed="left">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (page - 1) * size }}
            </template>
          </el-table-column>

          <!--表格列插槽-->
          <slot name="table" :data="items"></slot>

          <el-table-column v-if="!hideTableAction" label="操作" :width="actionWidth" fixed="right" align="center">
            <template slot-scope="scope">
              <!--表格操作插槽-->
              <div class="table-action">
                <slot name="tableAction" :data="scope.row"></slot>
                <!--                v-hasPermi="permissionEdit"-->
                <el-link v-if="!hideEdit" type="primary" @click.native.stop="editItem(scope.row)"
                >编辑
                </el-link>
                <el-link
                    v-if="!hideView"
                    type="primary"
                    @click.native.stop="
                    $router.push({
                      path: viewPath,
                      query: { id: scope.row[idKey] },
                    })
                  "
                >查看</el-link>
                <!--                  v-hasPermi="permissionDelete"-->
                <el-link
                    v-if="!hideDelete"

                    type="danger"
                    @click.native.stop="deleteItem(scope.row)"
                >删除
                </el-link>
                <!--                v-hasPermi="permissionCopy"-->
                <el-link v-if="!hideCopy" type="primary" @click.native.stop="copyItem(scope.row)"
                >复制
                </el-link
                >
                <el-link v-if="moveUp" type="primary" @click.native.stop="moveUpItem(scope.row, scope.$index)">上移</el-link>
                <el-divider v-if="moveUp" direction="vertical"></el-divider>
                <el-link v-if="moveDown" type="primary" @click.native.stop="moveDownItem(scope.row, scope.$index)"
                >下移
                </el-link
                >
                <el-divider v-if="moveDown" direction="vertical"></el-divider>
                <el-link v-if="moveTop" type="primary" @click.native.stop="moveTopItem(scope.row, scope.$index)"
                >置顶
                </el-link
                >
                <el-divider v-if="moveTop" direction="vertical"></el-divider>
                <el-link v-if="virtualDelete" type="danger" @click.native.stop="virtualDeleteItem(scope.row, scope.$index)"
                >移除
                </el-link
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
        <!--自定义数据插槽-->
        <div v-if="hideTable"  v-loading="loading" class="customize-data">
          <slot name="data" :data="items"></slot>
        </div>

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
          ref="multipleTable"
          :height="tableHeight || null"
          :header-row-style="{
            fontSize: '14px',
            fontFamily: 'PingFangSC-Medium, PingFang SC',
            fontWeight: 500,
            color: ' #333333',
            lineHeight: '22px',
          }"
          v-loading="loading"
          :data="items"
          :row-class-name="tableRowClassName"
          @select="handleSelectChange"
          @selection-change="selectionChange"
          @select-all="selectAll"
          @row-click="rowClick"
      >
        <!--        max-height="496"-->
        <el-table-column
            v-if="selection"
            :selectable="selectable"
            type="selection"
            width="50"
            align="center"
            fixed="left"
        ></el-table-column>
        <el-table-column v-if="showOrder" :label="order ? '推荐次序' : '序号'" width="80" align="center" fixed="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 + (page - 1) * size }}
          </template>
        </el-table-column>

        <!--表格列插槽-->
        <slot name="table" :data="items"></slot>

        <el-table-column v-if="!hideTableAction" label="操作" :width="actionWidth" fixed="right" align="center">
          <template slot-scope="scope">
            <!--表格操作插槽-->
            <div class="table-action">
              <slot name="tableAction" :data="scope.row"></slot>
              <!--               v-hasPermi="permissionEdit"-->
              <el-link v-if="!hideEdit" type="primary" @click="editItem(scope.row)"
              >编辑
              </el-link
              >
              <el-link v-if="!hideView" type="primary" @click="viewItem(scope.row)">{{ detailText || "查看" }}</el-link>
              <!--               v-hasPermi="permissionDelete"-->
              <el-link
                  v-if="!hideDelete"

                  type="danger"
                  @click.native="deleteItem(scope.row)"
              >删除
              </el-link
              >
              <!--               v-hasPermi="permissionCopy"-->
              <el-link v-if="!hideCopy" type="primary" @click.native="copyItem(scope.row)"
              >复制
              </el-link
              >
              <el-link v-if="moveUp" type="primary" @click.native="moveUpItem(scope.row, scope.$index)">上移</el-link>
              <el-divider v-if="moveUp" direction="vertical"></el-divider>
              <el-link v-if="moveDown" type="primary" @click.native="moveDownItem(scope.row, scope.$index)"
              >下移
              </el-link
              >
              <el-divider v-if="moveDown" direction="vertical"></el-divider>
              <el-link v-if="moveTop" type="primary" @click.native="moveTopItem(scope.row, scope.$index)">置顶</el-link>
              <el-divider v-if="moveTop" direction="vertical"></el-divider>
              <el-link v-if="virtualDelete" type="danger" @click.native="virtualDeleteItem(scope.row, scope.$index)"
              >移除
              </el-link
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
      <div v-if="hideTable"  v-loading="loading" class="customize-data">
        <slot name="data" :data="items"></slot>
      </div>


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
          <el-form class="big-input-box" ref="form" :model="form" :rules="rule"  :label-width="labelWidth" label-suffix=":">
            <!--表单插槽-->
            <slot name="form"></slot>
          </el-form>
        </div>
        <div v-if="!hideDialogAction" class="footer" slot="footer">
          <el-button size="" @click="closeDialog">取消</el-button>
          <el-button size="" v-if="!hideSave" type="primary" :loading="loading" @click="saveItem">{{ determineText }}
          </el-button>
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
import {downloadFile} from "@/utils/data";

export default {
  mixins: [rule],
  props: {
    // 表单对象
    form: {
      type: Object,
      default: () => ({}),
    },
    // 搜索对象
    query: {
      type: Object,
      default: () => ({}),
    },
    // 重置搜索对象
    resetQuery: {
      type: Object,
    },
    // 弹窗标题
    title: {
      type: String,
      default: "",
    },
    // 表格高度
    tableHeight: {
      type: String,
      default: "",
    },
    // 是否显示已选中数据
    showSelected: {
      type: Boolean,
      default: false,
    },
    // 是否显示已选中数据
    selectedKey: {
      type: String,
      default: "visiable",
    },
    // 表格是否开启多选模式
    selection: {
      type: Boolean,
      default: false,
    },
    // 表格是否开启单行点击监控
    useSelectRow: {
      type: Boolean,
      default: false,
    },
    // 选中次数限制
    selectMaxNumber: {
      type: Number,
    },
    // 当前选中次数限制
    currentSelectNumber: {
      type: Number,
    },
    // 当前选中项
    currentSelections: {
      type: Array,
    },
    // 获取数据方法
    getMethod: {
      type: Function,
    },
    // 自定义获取数据方法（无分页等）
    customGetMethod: {
      type: Function,
    },
    // 获取数据前设置请求参数
    beforeGetMethodSetQuery: {
      type: Function,
    },
    // 新增数据方法
    addMethod: {
      type: Function,
    },
    // 编辑数据方法
    updateMethod: {
      type: Function,
    },
    // 复制数据方法
    copyMethod: {
      type: Function,
    },
    // 删除数据方法
    deleteMethod: {
      type: Function,
    },
    // 批量删除数据方法
    deleteAllMethod: {
      type: Function,
    },
    // 导出数据方法
    exportMethod: {
      type: Function,
    },
    // 导出数据方法2
    exportMethod2: {
      type: Function,
    },
    exportName: {
      type: String,
      default: "导出",
    },
    addText: {
      type: String,
      default: "新增",
    },
    deleteBtnText: {
      type: String,
      default: "批量删除",
    },
    exportFileName: {
      type: String,
      default: "导出的文件",
    },
    exportFileName2: {
      type: String,
      default: "导出文件",
    },
    exportName2: {
      type: String,
      default: "导出",
    },
    // 获取数据后方法（items重新赋值等处理）
    afterGetMethod: {
      type: Function,
    },
    // 编辑前方法（将item需要提交的值赋到form，父组件必须操作）
    beforeEditMethod: {
      type: Function,
    },
    // 复制前方法（将item需要提交的值赋到form）
    beforeCopyMethod: {
      type: Function,
    },
    // 提交前方法，返回新的data值
    beforeSaveMethod: {
      type: Function,
    },
    // 提交前异步方法，返回新的data值
    beforeSaveAsyncMethod: {
      type: Function,
    },
    // 提交后方法
    afterSaveMethod: {
      type: Function,
    },
    // 删除前方法，返回新的data值
    beforeDeleteMethod: {
      type: Function,
    },
    // 提交数据方法
    submitSortMethod: {
      type: Function,
    },
    // 数据id key
    idKey: {
      type: String,
      required: true,
    },
    // 新增权限
    permissionAdd: {
      type: [Array, Number, String],
    },
    // 编辑权限
    permissionEdit: {
      type: [Array, Number, String],
    },
    // 复制权限
    permissionCopy: {
      type: [Array, Number, String],
    },
    // 删除权限
    permissionDelete: {
      type: [Array, Number, String],
    },
    // 新增页面地址
    addPath: {
      type: String,
      default: "",
    },
    // 编辑页面地址
    editPath: {
      type: String,
      default: "",
    },
    // 查看页面地址
    viewPath: {
      type: String,
      default: "",
    },
    // 隐藏新增按钮
    hideAdd: {
      type: Boolean,
      default: false,
    },
    // 导出
    showExport: {
      type: Boolean,
      default: false,
    },
    // 导出2
    showExport2: {
      type: Boolean,
      default: false,
    },
    // 批量删除
    multipleDelete: {
      type: Boolean,
      default: false,
    },
    // 隐藏搜索
    hideSearch: {
      type: Boolean,
      default: false,
    },
    // 隐藏分页
    hidePagination: {
      type: Boolean,
      default: false,
    },
    // 隐藏表格
    hideTable: {
      type: Boolean,
      default: false,
    },
    // 表格左边插槽
    useTableLeft: {
      type: Boolean,
      default: false,
    },
    // 隐藏表格操作列
    hideTableAction: {
      type: Boolean,
      default: false,
    },
    // 隐藏弹窗操作
    hideDialogAction: {
      type: Boolean,
      default: false,
    },
    // 隐藏编辑按钮
    hideEdit: {
      type: Boolean,
      default: false,
    },
    // 隐藏复制按钮
    hideCopy: {
      type: Boolean,
      default: true,
    },
    // 隐藏查看按钮
    hideView: {
      type: Boolean,
      default: false,
    },
    // 隐藏删除按钮
    hideDelete: {
      type: Boolean,
      default: false,
    },
    // 虚拟删除按钮
    virtualDelete: {
      type: Boolean,
      default: false,
    },
    // 隐藏表单确定按钮
    hideSave: {
      type: Boolean,
      default: false,
    },
    // 编辑和删除区域宽度
    actionWidth: {
      type: String,
      default: "180px",
    },
    // 弹窗宽度
    dialogWidth: {
      type: String,
      default: "500px",
    },
    // 是否点击遮罩关闭弹窗
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    // 弹窗是否关闭后销毁
    dialogDestroyOnClose: {
      type: Boolean,
      default: false,
    },
    // 表单label宽度，95容纳5个字
    labelWidth: {
      type: String,
      default: "95px",
    },
    showOrder: {
      default: true,
      type: Boolean,
    },
    // 推荐次序
    order: {
      type: Boolean,
      default: false,
    },
    // 上移
    moveUp: {
      type: Boolean,
      default: false,
    },
    // 下移
    moveDown: {
      type: Boolean,
      default: false,
    },
    // 置顶
    moveTop: {
      type: Boolean,
      default: false,
    },
    tableRowClassName: {
      type: Function,
      default: () => "",
    },
    // 每页个数
    defaultSize: {
      type: Number,
      default: 10,
    },
    // 每页个数
    detailText: {
      type: String,
      default: "",
    },
    // 删除文字
    deleteText: {
      type: String,
      default: "是否删除该条数据？",
    },
    // 确定文子
    determineText: {
      type: String,
      default: "确定",
    },
    // 编辑跳转页面新增其他参数
    detailOtherQueryKeyArr: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      defaultForm: _.cloneDeep(this.form),
      defaultQuery: _.cloneDeep(this.resetQuery || this.query),
      loading: true,
      dialog: false,
      mode: 0, // 0新增，1编辑
      items: [],
      page: 1,
      size: 10,
      sizes: [10, 20, 50, 100],
      total: 0,
      selections: [],
      oldCurrentSelectionsLength: 0,
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
    },
    items: {
      deep: true,
      handler: function (val) {
        if (this.showSelected && val.length > 0) {
          setTimeout(() => {
            this.$refs.multipleTable.clearSelection();
            const selectedData = this.items.filter((i) => i[this.selectedKey]);
            this.toggleSelection(selectedData);
            if (this.currentSelections.length > 0) {
              const selectedData = this.items.filter((i) => {
                return this.currentSelections.some((j) => j[this.idKey] === i[this.idKey])
              });
              this.toggleSelection(selectedData);
            }
          })

        }
      }
    },
    // 当前选中项改变
    currentSelections: {
      deep: true,
      handler: function (newVal) {
        if (newVal.length < this.oldCurrentSelectionsLength) {
          this.$refs.multipleTable.clearSelection();
          const selectedData = this.items.filter((i) => {
            return this.currentSelections.some((j) => j[this.idKey] === i[this.idKey])
          });
          this.toggleSelection(selectedData);
        }
        this.oldCurrentSelectionsLength = newVal.length;

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
      } else if (this.mode === 2) {
        text = "复制";
      }
      return text;
    },
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
      const {page, size, query} = this;
      let params = {};
      if (query?.dateRange) {
        // 判断有没有日期范围选择器
        params = {
          pageNo: page,
          pageSize: size,
          ...query,
          receiveStartDate: query.dateRange[0],
          receiveEndDate: query.dateRange[1],
        };
        delete params.dateRange;
      } else if (this.hidePagination) {
        params = {
          ...query,
        };
      } else {
        params = {
          pageNo: page,
          pageSize: size,
          ...query,
        };
      }
      if (this.beforeGetMethodSetQuery) {
        params = this.beforeGetMethodSetQuery(params)
      }
      this.loading = true;
      try {
        if (this.customGetMethod) {
          this.items = await this.customGetMethod({...query});
        } else {
          const res = await this.getMethod(params);
          this.items = res.records || res.rows || res.data || res;
          this.total = res.total;
        }
        this.loading = false;
        if (this.afterGetMethod) {
          const res = this.afterGetMethod(this.items)
          if (res) {
            this.items = res;
          }
        }
        setTimeout(() => {
          // ?
          if (this.showSelected) {
            const selectedData = this.items.filter((i) => i[this.selectedKey]);
            this.toggleSelection(selectedData);
          }
        });
        this.$emit("changeData");
      } finally {
        this.loading = false;
      }
    },
    // 选中
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      }
    },
    // 搜索
    search() {
      this.page = 1;
      this.getItems();
    },
    // 搜索重置
    resetSearch() {
      this.updateQuery(_.cloneDeep(this.resetQuery || this.defaultQuery));
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
        this.$emit("clickAdd");
      }
    },
    // 详情
    viewItem(item) {
      if (this.viewPath) {
        const query = {
          id: item[this.idKey],
        };
        this.detailOtherQueryKeyArr.forEach((i) => {
          query[i] = item[i];
        });
        this.$router.push({
          path: this.viewPath,
          query,
        });
        // if (this.detailOtherQueryKeyArr.length>0) {
        //   this.$router.push({
        //     path: this.viewPath,
        //     query,
        //   });
        // } else {
        //   this.$router.push({
        //     path: this.viewPath,
        //     query: { id: item[this.idKey] },
        //   });
        // }
      }
    },
    // 编辑
    editItem(item) {
      if (this.editPath) {
        const query = {
          id: item[this.idKey],
        };
        query[this.detailOtherQueryKey] = item[this.detailOtherQueryKey];
        if (this.detailOtherQueryKey) {
          this.$router.push({
            path: this.editPath,
            query,
          });
        } else {
          this.$router.push({
            path: this.editPath,
            query: {id: item[this.idKey]},
          });
        }
      } else {
        if (!this.beforeEditMethod) {
          console.error("请传入 beforeEditMethod 处理数据回填");
          return;
        }
        this.beforeEditMethod(item);
        this.openDialog();
        this.mode = 1;
        this.$emit("clickEdit");
      }
    },
    // 复制
    copyItem(item) {
      let {id, ...data} = item;
      console.log(id);
      if (this.beforeCopyMethod) {
        this.beforeCopyMethod(item);
      } else this.updateForm(_.cloneDeep(data));
      this.openDialog();
      this.mode = 2;
      this.$emit("clickAdd");
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },
    // 删除
    async deleteItem(item) {
      this.$confirm(this.deleteText, "提示", {
        type: "warning",
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
        type: "warning",
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
        type: "warning",
      }).then(async () => {
        this.loading = true;
        const {page, size, query} = this;
        try {
          const data = {
            ...query,
            pageNo: page,
            pageSize: size,
            ids: this.selections.map((item) => item[this.idKey]).join(','),
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
        type: "warning",
      }).then(async () => {
        this.loading = true;
        const {page, size, query} = this;
        try {
          const data = {
            ...query,
            pageNo: page,
            pageSize: size,
            ids: this.selections.map((item) => item[this.idKey]),
          };
          const res = await this.exportMethod2(data);
          // downloadFile(res, "浙江省未来乡村申报汇总");
          downloadFile(res, this.exportFileName2);
          // this.$notify.success('导出成功');
        } finally {
          this.loading = false;
        }
      });
    },
    // 批量删除 ids 所删除项的id
    async deleteMultiple(ids) {
      this.$confirm("是否批量删除所选数据？", "提示", {
        type: "warning",
      }).then(async () => {
        this.loading = true;
        try {
          let data;
          if (ids && ids.length > 0) {
            data = ids;
          } else {
            data = this.selections.map((item) => item[this.idKey]);
          }

          await this.deleteAllMethod(data);
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
      const {items} = this;
      const data = items.map((item, index) => {
        return {
          id: item.id,
          citySortNum: index + 1, // 加排序序号 从0开始
        };
      });
      this.loading = true;
      try {
        await this.submitSortMethod(data);
        this.$emit("submitSuccess");
        this.$message({
          message: "提交成功！",
          type: "success",
        });
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    // 保存
    async saveItem() {
      //console.log("点击了");
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            let data = this.form;
            if (this.beforeSaveMethod) {
              data = this.beforeSaveMethod();
            }
            if (this.beforeSaveAsyncMethod) { // 异步数据传递，保存前的数据校验
              data = await this.beforeSaveAsyncMethod();
              if (!data) {
                return
              }
            }
            if (this.mode === 0) {
              await this.addMethod(data);
            } else if (this.mode === 1) {
              await this.updateMethod(data);
            } else if (this.mode === 2) {
              await this.copyMethod(data);
            }
            if (this.afterSaveMethod) {
              this.afterSaveMethod();
            }
            this.$notify.success(`${this.modeText}成功`);
            this.closeDialog();
            this.resetForm();
            await this.getItems();
            this.$emit('afterSave');
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
    // 当用户手动勾选数据行的 Checkbox 时触发的事件 监听某一行的取消选中
    handleSelectChange(val, row) {
      if (!this.useSelectRow) return;
      const index = val.findIndex(i => i[this.idKey] === row[this.idKey])
      // console.log('handleSelectChange', val,row, index)
      if (index === -1) {
        this.$emit('cancelSelect', row);
      }
      // this.selections = val;
      // this.$emit("selectionChange", val);
    },
    //监听row-click事件，实现选中
    rowClick(row) {
      if(!this.useSelectRow) {
        return
      }
      let findRow = this.selections.find(c => c.id === row.id);  //找到选中的行
      if (findRow) {
        this.$emit('cancelSelect', row);
        // return;
      }
    },
    //  选中所有
    selectAll() {
      if (this.selectMaxNumber) {
        this.items.forEach((i, index) => {
          if (index >= this.selectMaxNumber) {
            this.$refs.multipleTable.toggleRowSelection(i, false);
          }
        });
      }
    },
    // 表格项是否能选
    selectable(row) {
      if (this.currentSelectNumber && this.currentSelections.length) {
        return this.currentSelectNumber < this.selectMaxNumber ||
            this.currentSelections.some((i) => i[this.idKey] === row[this.idKey])
      }
      if (this.selectMaxNumber) {
        return (
            this.selections.length < this.selectMaxNumber ||
            this.selections.some((i) => i[this.idKey] === row[this.idKey])
        );
      } else if (this.$attrs["disSelectId"]) {
        // 禁止选中ids []
        let ids = this.$attrs["disSelectId"];
        return !ids.includes(row[this.idKey]);
      } else {
        return true;
      }
    },
    // 同步form到父组件
    updateForm(form) {
      this.$emit("update:form", form);
    },
    // 同步query到父组件
    updateQuery(query) {
      this.$emit("update:query", query);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  box-sizing: border-box;
  // margin-bottom: 10px;
  > * {
    //margin-right: 15px;
    margin-bottom: 15px;
  }

  ::v-deep .label {
    font-size: 18px;
    //font-weight: 400;
    margin-right: 10px;
  }
  .search-btns {
    display: flex;
    align-items: center;
    height: 40px;
  }
}

.table-box {
  width: 100%;
  display: flex;

  .table-right {
    flex: 1;
  }
}
.customize-data {
  min-height: 200px;
}
//.table1 {
//  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.05);
//  border: 1px solid rgba(208, 230, 255, 1);
//  ::v-deep tr th {
//    background-color: rgba(240, 248, 255, 1);
//    color: #222;
//    border-left: 1px solid rgba(208, 230, 255, 1);
//    border-bottom: 1px solid rgba(208, 230, 255, 1) !important;
//    &:nth-child(1) {
//      border-left: none;
//    }
//  }
//}

.table-action {
  > * {
    margin: 0 4px;
  }
  .el-link {
    margin: 0 10px;
  }
}

.table-left {
  position: relative;
}
.footer .el-button {
  border-radius: 4px;
}

</style>
