<template>
  <div class="app-container">
    <el-card shadow="hover">
      <custom-table id="article-list" :data="List" :table-head="tableHead" :params="params" :show-selection="true"
                    :opt-width="180" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                    @handleSelectionChange="handleSelectionChange" @handleRowDblClick="handleRowDblClick"
                    @handleEdit="handleEdit" @handleDelete="handleDelete">
        <template v-slot:searchBar>
          <el-form ref="searchForm" :inline="true" :model="params" class="demo-form-inline" size="mini">
            <el-form-item prop="keyword">
              <el-input v-model="params.keyword" placeholder="搜索关键词" />
            </el-form-item>

            <el-form-item >
              <el-select v-model="params.Region" placeholder="地域">
                <el-option value="">请选择大区</el-option>
                <el-option v-for="item in RegionList" :label="item.RegionName" :value="item.Region"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="status">
              <el-select v-model="params.status" placeholder="状态">
                <el-option label="显示" :value="true"></el-option>
                <el-option label="隐藏" :value="false">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click.native="onSubmit">查询</el-button>
              <el-button icon="el-icon-refresh-left" @click.native="$refs['searchForm'].resetFields();onSubmit()">重置
              </el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini"
                         @click.native="$router.push('/article/article-add')">添加
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click.native="handleDeleteRows">删除</el-button>
              <el-button type="warning" icon="el-icon-rank" @click="dialogVisible = true">这是一个可移动弹窗</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template v-slot:opt="slotProps">
         <el-button size="mini" icon="el-icon-download" type="warning"
                    @click.stop="handleDownload(slotProps.scope.$index, slotProps.scope.row)">
         </el-button>
          <el-button size="mini" type="warning"
                     @click.stop="showFirewallList(slotProps.scope.$index, slotProps.scope.row)">防火墙规则
          </el-button>
          <el-button size="mini" type="warning"
                     @click.stop="handleReinstall(slotProps.scope.$index, slotProps.scope.row)">重装系统
          </el-button>
          <el-button size="mini" type="primary"
                     @click.stop="goOsOpen(slotProps.scope.$index, slotProps.scope.row)">开机
          </el-button>
          <el-button size="mini" type="info"
                     @click.stop="goOsClose(slotProps.scope.$index, slotProps.scope.row)">关机
          </el-button>
        </template>
      </custom-table>
    </el-card>
    <el-dialog v-el-drag-dialog title="弹窗" :visible.sync="dialogVisible">
      <span>这是一个可移动弹窗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog width="35%" title="重装系统" :visible.sync="dialogFormVisible">
      <el-form :model="formInfo">
        <el-form-item label="实例ID" :label-width="formLabelWidth">
          <el-input v-model="this_InstanceId" disabled></el-input>
        </el-form-item>
        <el-form-item label="实例名称" :label-width="formLabelWidth">
          <el-input v-model="this_InstanceName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前实例系统" :label-width="formLabelWidth">
          <el-input v-model="this_OsName" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择安装的新系统" :label-width="formLabelWidth">
          <el-select v-model="reinstallOsId" placeholder="请选择系统">
            <el-option v-for="item in reinstallOsList" :label="item.DisplayTitle" :value="item.BlueprintId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="goReinstall">确定</el-button>
      </div>
    </el-dialog>

<!-- 防火墙规则 S -->
    <el-dialog width="60%" title="防火墙规则" :visible.sync="firewallListShow">
      <div class="dialog-footer">
        <el-button type="primary" @click="showFirewallAdd">添加规则</el-button>
      </div>
     <el-table
    :data="firewallListData"
    style="width: 100%"
    max-height="450">
    <el-table-column
      fixed
      prop="AppType"
      label="应用类型"
      width="150">
    </el-table-column>
    <el-table-column
      prop="CidrBlock"
      label="来源"
      width="120">
    </el-table-column>
    <el-table-column
      prop="Protocol"
      label="协议"
      width="120">
    </el-table-column>
    <el-table-column
      prop="Port"
      label="端口"
      width="120">
    </el-table-column>
    <el-table-column
      prop="Action"
      label="策略"
      width="120">
    </el-table-column>
    <el-table-column
      prop="FirewallRuleDescription"
      label="备注"
      width="300">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="delFirewall(scope.$index, firewallListData)"
          type="text"
          size="small">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="firewallListShow = false">取消</el-button>
        <el-button type="primary" @click="firewallListShow = false">确定</el-button>
      </div>
    </el-dialog>

<!-- 防火墙规则 E -->



<!-- 防火墙规则新增 S -->
<el-dialog width="35%" title="防火墙规则新增" :visible.sync="firewallAddShow">
      <el-form :model="formInfo">
        <el-form-item label="应用类型" :label-width="formLabelWidth">
          <el-select v-model="ProtocolChose" placeholder="请选择系统">
            <el-option v-for="item in Protocol" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="端口" :label-width="formLabelWidth">
          <el-input v-model="PortValue" :disabled="ProtocolChose == 'ALL' ||  ProtocolChose == 'ICMP'? true : false" placeholder="如53,80,443或80-90"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="firewallAddShow = false">取消</el-button>
        <el-button type="primary" @click="addFirewall" :loading="firewallAddHttp">确定</el-button>
      </div>
    </el-dialog>
<!-- 防火墙规则新增 E -->
  </div>
</template>

<script>
import CustomTable from '@/components/CustomTable'
import { pushLogList,newOsList,osOpen,osClose,firewallList,firewallDel,firewallAdd } from '@/api/wxpush/push_log'

export default {
  name: 'ArticleList',
  components: {
    CustomTable
  },
  data() {
    return {
      List: [],
      selectionIdList: [],
      tableHead: [
        {
          label: '序号',
          prop: 'id',
          width: 100
        },
        {
          label: '实例ID',
          prop: 'InstanceId',
          width: 100
        },
        {
          label: '实例名称',
          prop: 'InstanceName',
          width: 150
        },
        {
          label: '实例系统',
          prop: 'OsName',
          width: 150
        },
        {
          label: '实例IP',
          prop: 'PublicAddresses',
          width: 200
        },
        {
          label: '状态',
          prop: 'status',
          component: row => {
            return row.InstanceState === 'RUNNING'
              ? { is: 'custom-tag', type: 'success', title: '运行中' }
              : { is: 'custom-tag', type: 'danger', title: '已关机' }
          }
        },
        {
          label: '创建时间',
          prop: 'CreatedTime',
          width: 140
        },
        {
          label: '到期时间',
          prop: 'ExpiredTime',
          width: 140
        }
      ],
      params: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        keyword: '',
        recommend: '',
        top: '',
        status: '',
        Region:'ap-shanghai'
      },
      formInfo:{
      },
      RegionList:[
        {'Region':'ap-beijing','RegionName':'华北地区(北京) ap-beijing'},
        {'Region':'ap-chengdu','RegionName':'西南地区(成都) ap-chengdu'},
        {'Region':'ap-guangzhou','RegionName':'华南地区(广州) ap-guangzhou'},
        {'Region':'ap-hongkong','RegionName':'港澳台地区(中国香港) ap-hongkong'},
        {'Region':'ap-shanghai','RegionName':'华东地区(上海) ap-shanghai'},
        {'Region':'ap-singapore','RegionName':'东南亚地区(新加坡) ap-singapore'},
        {'Region':'eu-frankfurt','RegionName':'欧洲地区(法兰克福) eu-frankfurt'},
        {'Region':'na-siliconvalley','RegionName':'美国西部(硅谷) na-siliconvalley'},
        {'Region':'ap-mumbai','RegionName':'亚太地区(孟买) ap-mumbai'},
        {'Region':'eu-moscow','RegionName':'欧洲地区(莫斯科) eu-moscow'},
        {'Region':'ap-tokyo','RegionName':'亚太地区(东京) ap-tokyo'},
        {'Region':'ap-nanjing','RegionName':'华东地区(南京) ap-nanjing'},
      ],
      dialogVisible: false, //可移动弹窗
      dialogFormVisible:false,// 操作页面
      formLabelWidth: '150px',
      this_InstanceId:'',
      this_InstanceName:'',
      this_OsName:'',
      reinstallOsList:[],
      reinstallOsId:'',
      firewallListShow:false,//防火墙规则列表展示。默认false
      firewallListData:[],//防火墙列表表格
      firewallAddShow:false,//防火墙弹窗新增
      Protocol:['TCP','UDP','ICMP','ALL'],//防火墙规则信息列表
      ProtocolChose:'',//防火墙规则信息列表选择
      PortValue:'',//防火墙端口号输入
      firewallAddHttp:false,//防火墙新增加载
    }
  },
  async mounted() {
    await this.getPushLogList()
  },
  watch:{
ProtocolChose: {
      handler(newValue,oldValue) {
        console.log(newValue,oldValue)
        newValue == 'ALL' ||  newValue == 'ICMP' ? this.PortValue = 'ALL' : this.PortValue = ''
      }
      //,deep: true
    }
  },
  methods: {
    
    getPushLogList() {
      return pushLogList(this.params)
        .then(res => {
          // console.log(res.data.TotalCount)
          this.List = res.data.InstanceSet
          res.data.InstanceSet.forEach((item, index) => {
            item.id = index+1
          })
          this.params.total = res.data.TotalCount
        })
        .catch(() => {
        })
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getPushLogList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getPushLogList()
    },
    handleSelectionChange(val) {
      this.selectionIdList = val
    },
    handleRowDblClick(val) {
      this.$router.push({
        path: '/article/article-edit',
        query: {
          id: val
        }
      })
    },
    handleEdit(index, row) {
      // this.handleRowDblClick(row.id)
      console.log(row.InstanceId)
      this.dialogFormVisible=true
      this.this_InstanceId=row.InstanceId
    },
    handleDelete(index, row) {
      articleDelete({ ids: [row.id] })
        .then(res => {
          this.List.splice(index, 1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(() => {
        })
    },
    handleDownload(index, row) {
      this.$message({
        message: '当前下载行的id是' + row.id,
        type: 'success'
      })
    },
    handleDeleteRows() {
      let self = this
      if (this.selectionIdList.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'error'
        })
        return false
      }
      articleDelete({ ids: this.selectionIdList })
        .then(res => {
          //这里删除还可以使用逆向循环删除，删除以后还可以重新获取数据
          this.List = this.List.filter(
            item => this.selectionIdList.indexOf(item.id) == -1
          )
          this.$message({
            message: '删除成功',
            type: 'success',
            onClose: function() {
              self.getArticleLst()
            }
          })
        })
        .catch(() => {
        })
    },
    onSubmit() {
      this.params.page = 1
      this.params.pageSize = 10
      this.getPushLogList()
    },

    //重装系统
    handleReinstall(index,row){
      this.this_InstanceId=row.InstanceId
      this.this_InstanceName=row.InstanceName
      this.this_OsName=row.OsName
      this.getOsList(row.InstanceId)
      this.dialogFormVisible=true
    },

    //获取当前可装系统
    getOsList(InstanceId) {
      const params={
        InstanceId:InstanceId,
        Region:this.params.Region
      }
      return newOsList(params)
        .then(res => {
          console.log(res.data.BlueprintSet)
          this.reinstallOsList=res.data.BlueprintSet
        })
        .catch(() => {
        })
    },

    //请求重装系统
    goReinstall(){
      this.dialogFormVisible=false
      const params={
        BlueprintId:this.reinstallOsId,
        Region:this.params.Region
      }
    },

    //开机
    goOsOpen(index,row){
      this.$confirm('此操作将开启该服务器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const params={
        InstanceId:row.InstanceId,
        Region:this.params.Region
      }
      return osOpen(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '开启成功!'
          })
          this.$message(res.data.message)
        })
        .catch(() => {
        })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      
    },

    //关机
    goOsClose(index,row){
      this.$confirm('此操作将关闭该服务器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const params={
        InstanceId:row.InstanceId,
        Region:this.params.Region
      }
      return osClose(params)
        .then(res => {
           this.$message({
            type: 'success',
            message: '关闭成功!'
          })
          this.$message(res.data.message)
        })
        .catch(() => {
        })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      
    },
    //获取防火墙规则列表接口
getFirewallList(InstanceId){
  const Region = this.params.Region
      return firewallList({
        InstanceId,
        Region
      }).then(res => {
          console.log(res.data)
          let firewallListData = res.data.FirewallRuleSet
          firewallListData.forEach(item=>{
            item.Action == 'ACCEPT' ? item.Action = '允许' :  item.Action = '拒绝' 
          })
          this.firewallListData = firewallListData
          this.firewallListShow = true
        })
        .catch(() => {
        })
},

    //展示防火墙规则列表
showFirewallList(index,row){
  this.this_InstanceId=row.InstanceId
      this.this_InstanceName=row.InstanceName
      this.this_OsName=row.OsName
      console.log(row)
      this.getFirewallList(row.InstanceId)
},
//删除选中防火墙规则
 delFirewall(index, rows) {
           console.log(index,rows[index])
           this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          firewallDel({
InstanceId:this.this_InstanceId,
Region:this.params.Region,
FirewallRules:{
  Protocol:rows[index].Protocol,
  Port:rows[index].Port
}
   }).then(res=>{
console.log(res.data)
 this.$message({
            type: 'success',
            message: '删除成功!'
          })
this.getFirewallList(this.this_InstanceId)
   }).catch(err=>{
     console.log(err)
   })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
   

      },
//显示添加防火墙规则
  showFirewallAdd(){
    this.firewallAddShow = true
    // this.getFirewallList(this.this_InstanceId)
  },
  
  //添加防火墙规则
  addFirewall(){
    if(this.PortValue){
      this.firewallAddHttp = true
firewallAdd({
InstanceId:this.this_InstanceId,
Region:this.params.Region,
FirewallRules:{
  Protocol:this.ProtocolChose,
  Port:this.PortValue
}
}).then(res=>{
  this.firewallAddHttp = false
   this.$message({
            type: 'success',
            message: '添加成功!'
          })
console.log(res.data)
this.firewallAddShow = false
this.getFirewallList(this.this_InstanceId)

   }).catch(err=>{
      this.$message.error('添加失败')
     this.firewallAddHttp = false
     console.log(err)
   })
    }


  }
},
}
</script>

<style></style>
