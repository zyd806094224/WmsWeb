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
    <el-button type="primary" @click="exportToExcel">导出Excel</el-button>
  </div>

</template>

<script>

import * as XLSX from 'xlsx';

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
    },

    exportToExcel() {
      this.$http.get('/sms/list').then(res => {
        console.log(res)
        if (res.code == 200) {
          if(res.data){
            const data = [
              ["电话号", "短信内容", "发送时间"]
            ];
            let dataList = res.data
            const convertedInfo = dataList.map(item => [
              item["phonenumber"],
              item["content"],
              item["sendtime"]
            ]);
            data.push(...convertedInfo);
            const ws = XLSX.utils.aoa_to_sheet(data); // 将数组转换为工作表
            const wb = XLSX.utils.book_new(); // 创建一个新的工作簿
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // 将工作表添加到工作簿中
            XLSX.writeFile(wb, this._generateFileName()); // 导出文件并指定文件名
          }
        } else {
          alert('获取数据失败')
        }
      })
    },

    _generateFileName(){
      // 获取当前时间并格式化
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      // 拼接文件名
      const filename = `sms_${year}${month}${day}_${hours}${minutes}${seconds}.xlsx`;
      return filename;
    }

  },
  mounted() {
    this.loadPost();
  }
}

</script>


<style scoped>

</style>
