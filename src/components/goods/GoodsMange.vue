<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="请输入物品名" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>

      <el-select v-model="storage" placeholder="请选择仓库" style="margin-left: 5px;">
        <el-option
            v-for="item in storageData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="goodsType" placeholder="请选择分类" style="margin-left: 5px;">
        <el-option
            v-for="item in goodsTypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId != 2">新增</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="inGoods" v-if="user.roleId != 2">入库</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="outGoods" v-if="user.roleId != 2">出库</el-button>
    </div>
    <el-table :data="tableData" :header-cell-style="{background: '#f2f5fc',color: '#555'}" border
              highlight-current-row
              @current-change="selectCurrentChange">
      <el-table-column prop="id" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="name" label="物品名" width="180">
      </el-table-column>
      <el-table-column prop="storage" label="仓库" width="180" :formatter="formatStorage">
      </el-table-column>
      <el-table-column prop="goodsType" label="分类" width="180" :formatter="formatGoodsType">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="180">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column prop="operate" label="操作" v-if="user.roleId != 2">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 5px">
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20,50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="物品名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="仓库" prop="storage">
          <el-col :span="20">
            <el-select v-model="form.storage" placeholder="请选择仓库">
              <el-option
                  v-for="item in storageData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="分类" prop="goodsType">
          <el-col :span="20">
            <el-select v-model="form.goodsType" placeholder="请选择分类">
              <el-option
                  v-for="item in goodsTypeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-col :span="20">
            <el-input v-model="form.count"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
        title="出入库"
        :visible.sync="inDialogVisible"
        width="30%"
        center>
      <el-dialog
          width="75%"
          title="用户选择"
          :visible.sync="innerVisible"
          append-to-body>
        <SelectUser @doSelectUser="doSelectUser"></SelectUser>
        <span slot="footer" class="dialog-footer">
    <el-button @click="innerVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmUser">确 定</el-button>
  </span>
      </el-dialog>
      <el-form ref="form1" :rules="rules1" :model="form1" label-width="80px">
        <el-form-item label="物品名" prop="name">
          <el-col :span="20">
            <el-input v-model="form1.goodsname" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="申请人" prop="name">
          <el-col :span="20">
            <el-input v-model="form1.username" readonly @click.native="selectUser"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-col :span="20">
            <el-input v-model="form1.count"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form1.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="inDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doInGoods">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from "@/components/user/SelectUser";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'GoodsMange',
  components: {SelectUser},
  data() {
    let checkCount = (rule, value, callback) => {
      if (value > 9999) {
        callback(new Error('数量输入过大'));
      } else {
        callback();
      }
    };
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      goodsTypeData: [],
      storageData: [],
      tableData: [],
      storage: '',
      goodsType: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      name: '',
      centerDialogVisible: false,
      inDialogVisible: false,
      innerVisible: false,
      currentRow: {},
      tempUser: {},
      form: {
        id: '',
        name: '',
        storage: '',
        goodsType: '',
        count: '',
        remark: ''
      },
      form1: {
        goods: '',
        goodsname: '',
        count: '',
        username: '',
        userId: '',
        admin_id: '',
        remark: '',
        action: '1', //1入库、2出库、3新增物品方式入库
        createtime: Date.now()
      },
      rules1: {},
      rules: {
        name: [
          {required: true, message: '请输入物品名', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
        storage: [
          {required: true, message: '请选择仓库', trigger: 'blur'}
        ],
        goodsType: [
          {required: true, message: '请选择分类', trigger: 'blur'}
        ],
        count: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {pattern: /^([1-9][0-9]*){1,4}$/, message: '数量必须为正整数字', trigger: "blur"},
          {validator: checkCount, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    doSelectUser(val) {
      this.tempUser = val
      console.log(this.tempUser)
    },
    confirmUser() {
      this.form1.username = this.tempUser.name
      this.form1.userId = this.tempUser.id
      this.innerVisible = false
    },
    selectUser() {
      this.innerVisible = true
    },
    selectCurrentChange(val) {
      this.currentRow = val;
    },
    formatStorage(row) {
      let temp = this.storageData.find(item => {
        return item.id === row.storage
      })
      return temp && temp.name
    },
    formatGoodsType(row) {
      let temp = this.goodsTypeData.find(item => {
        return item.id === row.goodsType
      })
      return temp && temp.name
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    resetInForm() {
      this.$refs.form1.resetFields();
    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/goods/save', this.form)
          .then(res => res.data)
          .then(res => {
            if (res.code == 200) {
              console.log(res)
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.form1.goods = res.data.id
              this.form1.count = res.data.count
              this.doInGoods2()
              this.centerDialogVisible = false
              this.loadPost()
              this.resetForm()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          })
    },
    doInGoods() {
      this.$axios.post(this.$httpUrl + '/record/save', this.form1)
          .then(res => res.data)
          .then(res => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.inDialogVisible = false
              this.loadPost()
              this.resetInForm()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          })
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/goods/update', this.form)
          .then(res => res.data)
          .then(res => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.form1.goods = res.data.id
              this.form1.count = res.data.count
              this.doInGoods2()
              this.centerDialogVisible = false
              this.loadPost()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) { //如果表单ID存在
            this.doMod(); //修改
          } else {
            this.doSave(); //新增
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    add() {
      this.centerDialogVisible = true
      this.$nextTick(() => { //异步执行
        this.resetForm()
        this.form.id = ''
      })
    },
    doInGoods2() { //用户点击货物新增按钮的入库记录
      this.form1.username = this.user.name
      this.form1.userId = this.user.id
      this.form1.goodsname = this.form.name
      this.form1.admin_id = this.user.id
      this.form1.userId = this.user.id
      this.form1.action = '3'
      this.$axios.post(this.$httpUrl + '/record/save', this.form1)
          .then(res => res.data)
          .then(res => {
            if (res.code == 200) {
              // this.$message({
              //   message: '操作成功',
              //   type: 'success'
              // });
              this.loadPost()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          })
    },
    outGoods() {
      if (!this.currentRow.id) {
        alert('请选择记录')
        return;
      }
      this.inDialogVisible = true
      this.$nextTick(() => { //异步执行
        this.resetInForm()
      })
      this.form1.goodsname = this.currentRow.name;
      this.form1.goods = this.currentRow.id;
      this.form1.admin_id = this.user.id
      this.form1.action = '2'
    },
    inGoods() {
      if (!this.currentRow.id) {
        alert('请选择记录')
        return;
      }
      this.inDialogVisible = true
      this.$nextTick(() => { //异步执行
        this.resetInForm()
      })
      this.form1.goodsname = this.currentRow.name;
      this.form1.goods = this.currentRow.id;
      this.form1.admin_id = this.user.id
      this.form1.action = '1'
    },
    mod(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.storage = row.storage
        this.form.goodstype = row.goodstype
        this.form.count = row.count
        this.form.remark = row.remark;
      })
    },
    del(id) {
      this.$axios.get(this.$httpUrl + '/goods/del?id=' + id)
          .then(res => res.data)
          .then(res => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.centerDialogVisible = false
              this.loadPost()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          })
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/goods/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          storage: this.storage + '',
          goodsType: this.goodsType + ''
        }
      })
          .then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.code == 200) {
              this.tableData = res.data
              this.total = res.total
            } else {
              alert('获取数据失败')
            }
          })
    },
    loadStorage() {
      this.$axios.get(this.$httpUrl + '/storage/list')
          .then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.code == 200) {
              this.storageData = res.data
            } else {
              alert('获取数据失败')
            }
          })
    },
    loadGoodsType() {
      this.$axios.get(this.$httpUrl + '/goodstype/list')
          .then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.code == 200) {
              this.goodsTypeData = res.data
            } else {
              alert('获取数据失败')
            }
          })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.loadPost()
    },
    resetParam() {
      this.name = ''
      this.storage = ''
      this.goodsType = ''
    }
  },
  beforeMount() {
    this.loadGoodsType()
    this.loadStorage()
    this.loadPost();
  }
}
</script>

<style scoped>

</style>
