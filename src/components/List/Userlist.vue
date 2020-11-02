<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索 -->
            <el-row :gutter="40">
                <el-col :span='20'>
                        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryinfo.query" clearable @clear="getUserlist">
                            <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
                        </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type="primary" plain @click="adddialog = true">添加用户</el-button>
                </el-col>
            </el-row>
             <!-- 用户列表 -->
            <el-table stripestyle="width: 100%" :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#409eff" @change="swithchang(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                         <el-tooltip content="修改内容" placement="top" effect="light" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle @click="editinfo(scope.row.id)"></el-button>
                        </el-tooltip>
                         <el-tooltip content="删除内容" placement="top" effect="light" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle @click="deteruser(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="分配角色" placement="top" effect="light" :enterable="false">
                            <el-button type="info" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryinfo.pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="queryinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="adddialog" width="50%" @close="closedialog">
            <!-- 内容 -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                 <el-form-item label="用户手机" prop="mobile">
                    <el-input v-model="ruleForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialog = false">取 消</el-button>
                <el-button type="primary" @click="adduser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户对话框 -->
         <el-dialog title="修改内容" :visible.sync="editialog" width="50%" @close="closeeditdialog">
            <!-- 内容 -->
            <el-form :model="editfrom" :rules="editrules" ref="editref" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名称">
                    <el-input v-model="editfrom.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="editfrom.email"></el-input>
                </el-form-item>
                 <el-form-item label="用户手机" prop="mobile">
                    <el-input v-model="editfrom.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editialog = false">取 消</el-button>
                <el-button type="primary" @click="edituser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
export default {
    data(){
        //定义电话的规则
         var checkmobile = (rule, value, callback) => {
             //定义电话的正则规则
            const phome = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (phome.test(value)){
                return callback()
            }
            callback(new Error('请输入合法的手机号！'))
         }
        return{
            //获取用户列表的数据
            queryinfo: {
                //查询数据，当前页码，每页显示条数
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            //所有用户列表
            userlist: [],
            total:0,
            //添加用户对话框的显示状态
            adddialog: false,
            //编辑内容对话框的显示状态
            editialog:false,
            //用户查询的数据
            editfrom: {},
            //表单的数据
            ruleForm: {
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //表单的认证规则
            rules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                mobile: [
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                    { validator: checkmobile, trigger: 'blur' }
                ]
            },
            //修改内容的认证规则
            editrules: {
                 email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                mobile: [
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                    { validator: checkmobile, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        //创建用户列表
        this.getUserlist()
    },
    methods: {
         
        async getUserlist(){
            const {data: res} = await this.$http.get('users', { params: this.queryinfo})
             if (res.meta.status !== 200) return this.$message.error('获取管理员列表失败！')
             this.userlist = res.data.users
             this.total = res.data.total
        },
        //监听每页显示的条数
        handleSizeChange(newSize){
            this.queryinfo.pagesize = newSize
            //重新获取数据
            this.getUserlist()
        },
        //监听页码的改变
        handleCurrentChange(newPage){
            this.queryinfo.pagenum = newPage
            //重新获取数据
            this.getUserlist()
        },
        //监听swith 开关发生改变的状态
        async swithchang(userinfo){
            // console.log(userinfo)
            const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200){
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败！')
            } 
            this.$message.success('更新用户状态成功！')
        },
        // 重置对话框的内容
        closedialog(){
             this.$refs.ruleForm.resetFields()
        },
       //点击确定，添加用户
        adduser() {
            this.$refs.ruleForm.validate(async valid => {
                // console.log(valid)
                if (!valid) return
                //添加网络的请求，ruleForm：请求的参数
                const { data: result } = await this.$http.post('users', this.ruleForm)
                console.log(result)
                if (result.meta.status !== 201) {
                    this.$message.error('添加失败！')
                }
                this.$message.success('添加成功！')
                //隐藏对话框
                this.adddialog = false
                //重新获取列表数据
                this.getUserlist()
            })
        },
        //编辑内容的对话框
        async editinfo(id){
            
            console.log(id)
            const {data: res} = await this.$http.get('users/' + id)
             if (res.meta.status !== 200){
                return this.$message.error('用户查询信息失败！')
            } 
            this.$message.success('用户查询信息成功！')
            this.editfrom = res.data
            this.editialog = true
        },
        //重置修改内容的对话框
        closeeditdialog(){
            this.$refs.editref.resetFields()
        },
        //点击确定，修改用户内容
        edituser() {
              this.$refs.editref.validate(async valid => {
                // console.log(valid)
                if (!valid) return
                //添加网络的请求
                const { data: result } = await this.$http.put('users/' + this.editfrom.id, {
                    email: this.editfrom.email,
                    mobile: this.editfrom.mobile
                })
                // console.log(result)
                if (result.meta.status !== 200) {
                    this.$message.error('修改失败！')
                }
                //隐藏对话框
                this.editialog = false
                //重新获取列表数据
                this.getUserlist()
                this.$message.success('修改成功！')
            })
        },
        //删除用户
        async deteruser(id){
            console.log(id);
            //确认弹框的按钮
        const res = await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
             type: 'warning'
        }).catch(err => err)
        //返回的字符串为confirm表示确定，cancel：取消
        console.log(res)
        if (res !== 'confirm'){
          return this.$message.info("已取消删除！")
        }
        const {data: rest} = await this.$http.delete('users/' + id)
        console.log(rest)
        if(rest.meta.status !== 200){
           return this.$message.error(rest.meta.msg);
        }
        this.$message.success("已删除改用户！")
        this.getUserlist()
        }
    }
    
    
}
</script>

<style lang="less" scoped>
.el-pagination{
    margin-top: 20px;
    text-align: center;
}

</style>
