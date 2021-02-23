<template>
    <div class="orders">
        <el-card>
            <!-- <el-button type="primary" style="margin-bottom: 20px;" @click="()=>{courseId = null; formVisible = true}">添加课程</el-button> -->
            <el-table
                :data="userList"
                style="width: 100%;margin-bottom: 20px;"
                border>
                <el-table-column
                    prop="headPortrait"
                    label="用户头像"
                    width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.headPortrait" class="picture" alt="暂无">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户昵称"
                    width="160">
                    <template slot-scope="scope">
                        {{scope.row.name ? scope.row.name : '暂无'}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="用户邮箱"
                    width="250">
                    <template slot-scope="scope">
                        {{scope.row.email}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户手机号"
                    min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.phoneNumber}}
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="isShow"
                    label="是否设置为推荐课程"
                    width="150">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isShow" @change="handleIsShow(scope.row.id)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <el-pagination 
                layout="total, prev, pager, next" 
                :total="userTotal" 
                :page-size="pageQuery.size"
                background
                @current-change="($event) => { pageQuery.page = $event; fetchUserList()}">
            </el-pagination>

            <!-- <el-dialog :title="`${!courseId ? '添加' : '编辑'}课程`" :visible.sync="formVisible" @close="$refs['formData'].resetFields()">
                <el-form :model="formData" ref="formData" label-width="130px">
                    <el-form-item label="课程ID：" prop="id">
                        <el-input v-model="formData.id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="课程名称：" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="课程简介：" prop="introduction">
                        <el-input v-model="formData.introduction"></el-input>
                    </el-form-item>
                    <el-form-item label="课程简略图：" prop="pictureUrl">
                        <el-input v-model="formData.pictureUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="视频链接：" prop="videoUrl">
                        <el-input v-model="formData.videoUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="课程图片：" prop="pictureUrl">
                        <el-upload
                            class="avatar-uploader"
                            :action="`${axios.defaults.baseURL}/api/upload/singlePhotoUpload`"
                            name="pic"
                            :show-file-list="false" 
                            :on-progress="uploadProgress"
                            :on-success="res => {formData.pictureUrl = res.data; isUpload = false}">
                            <el-progress v-if="isUpload" type="circle" :percentage="progressPercentage" :width="160" style="display:block"></el-progress>
                            <img v-else-if="formData.pictureUrl" :src="formData.pictureUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="上传附件" prop="resourceUrlList">
                        <el-upload
                            class="upload-demo"
                            :action="`${axios.defaults.baseURL}/api/upload/fileUpload`"
                            :on-change="handleChange"
                            :file-list="resourceList">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="formVisible = false">取 消</el-button>
                    <el-button type="primary" @click="!courseId ? handleAdd() : handlePut()">确 定</el-button>
                </div>
            </el-dialog> -->

        </el-card>
    </div>
</template>

<script>
import { getAllUser } from '@/api/index'

export default {
    data(){
        return {
            pageQuery: {
                page: 1,
                size: 10
            },
            userTotal: 0,
            userList: [],
            formVisible: false,
            formData: {
                id: "",
                name: "",
                introduction: "",
                pictureUrl: '',
                videoUrl: '',
                isShow: true,
                viewCount: '',
                resourceUrlList: []
            },
            resourceList: [],
            courseId: null,
            isUpload: false,
            progressPercentage: 0
        }
    },
    created(){
        this.fetchUserList();
    },
    methods: {
        async fetchUserList(){    // 获取列表
            let {data: res} = await getAllUser(this.pageQuery);
            if(res.success) {
                console.log(res);
                this.userTotal = res.data.totalCount;
                this.userList = res.data.list;
            }
        },
        async handleEdit(id){
            this.courseId = id;
            console.log(id);
            let {data: res} = await getCourseDetail(id);
            this.formVisible = true;
            this.$nextTick(() => {
                console.log(res);
                // if(res.status ==200)
                //     this.formData = res.data;
            })
        },
        handleDelete(id){
            console.log(id);
            this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data: res} = await deleteCourse(id)
                if(res.success)
                    this.afterSuccessHandle(res.message)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        async handleAdd(){
            let {data: res} = await addCourse(this.formData)
            if(res.success)
                this.afterSuccessHandle(res.message)
        },
        async handlePut(){
            let {data: res} = await putAd(this.courseId, this.formData);
            console.log(res)
            if(res.status == 200)
                this.afterSuccessHandle(res.message)
        },
        async handleIsShow(id){
            let {data: res} = await putAdShow(id);
            console.log(res)
            if(res.status == 200)
                this.afterSuccessHandle(res.message)
        },
        handleChange(file, fileList) {
            this.resourceList = fileList.slice(-3);
            this.resourceList.forEach(item => {
                if(item.status == 'success') {
                    this.formData.resourceUrlList.push(item.response.fileUrl);
                    this.$message.success('上传成功')
                }
            })
        },
        afterSuccessHandle(msg){
            this.fetchUserList() && (this.formVisible = false);
            this.$message.success(msg);
        },
        uploadProgress(event, file, fileList){
            this.isUpload = true;
            this.progressPercentage = +file.percentage.toFixed(0)
        }
    }
}
</script>


<style lang="less" scoped>
.picture{
    // width: 100px;
    height: 50px;
}
</style>
