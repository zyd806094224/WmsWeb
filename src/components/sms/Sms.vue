<template>

  <div>
    <el-table :data="tableData" :header-cell-style="{background: '#f2f5fc',color: '#555'}" border>
      <el-table-column prop="phonenumber" label="电话号" width="180">
      </el-table-column>
      <el-table-column prop="content" label="短信内容" width="580">
      </el-table-column>
      <el-table-column prop="sendtime" label="发送时间" width="180">
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

  </div>

</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Sms',
  data(){

    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,

    }
  },
  methods:{
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

    loadPost(){
      // this.$http.get('/sms/list')//.then(res => res.data)
      //     .then(res => {
      //       console.log(res)
      //       if (res.code == 200) {
      //         this.tableData = res.data
      //         this.total = res.data.length
      //       } else {
      //         alert('获取数据失败')
      //       }
      //     })

      this.$http.post('/sms/listPaging',{
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
            console.log(res)
            if (res.code == 200) {
              this.tableData = res.data
              this.total = res.total
            } else {
              alert('获取数据失败')
            }
          })
    }

  },
  mounted() {
    this.loadPost();
  }
}

</script>


<style scoped>

</style>
