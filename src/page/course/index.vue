<template>
    <div class="orders">
        <el-card>
            <el-button type="primary" style="margin-bottom: 20px;" @click="()=>{courseId = null; formVisible = true}">添加课程</el-button>
            <el-table
                :data="courseList"
                style="width: 100%;margin-bottom: 20px;"
                border>
                <el-table-column
                    prop="goodsType"
                    label="课程类别"
                    width="250">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isHottest">最热课程</el-tag>
                        <el-tag v-if="scope.row.isLatest" type="success">最新课程</el-tag>
                        <el-tag v-if="scope.row.isRecommend" type="warning">推荐课程</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="课程ID"
                    width="120">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="课程名称"
                    width="200">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="isShow"
                    label="是否设置为推荐课程"
                    width="150">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isRecommend" @change="handleRecommend(scope.row.isRecommend, scope.row.id)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pictureUrl"
                    label="课程图片"
                    width="180">
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" class="picture" alt="暂未设置">
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination 
                layout="total, prev, pager, next" 
                :total="courseTotal" 
                :page-size="pageQuery.size"
                background
                @current-change="($event) => { pageQuery.page = $event; fetchCourseList()}">
            </el-pagination>

            <el-dialog :title="`${!courseId ? '添加' : '编辑'}课程`" :visible.sync="formVisible" @close="$refs['formData'].resetFields()">
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
                    <el-form-item label="视频链接：" prop="videoUrl">
                        <el-input v-model="formData.videoUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="上传课程图片" prop="pictureUrl">
                        <el-upload
                            class="avatar-uploader"
                            :action="`${axios.defaults.baseURL}/api/upload/singlePhotoUpload`"
                            :show-file-list="false"
                            :on-progress="uploadProgress"
                            :on-success="res => {formData.pictureUrl = res.imageUrl; isUpload = false}">
                            <el-progress v-if="isUpload" type="circle" :percentage="progressPercentage" :width="160" style="display:block"></el-progress>
                            <img v-else-if="formData.pictureUrl" :src="formData.pictureUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="上传附件" prop="resourceUrlList" v-if="!courseId">
                        <el-upload
                            class="upload-demo"
                            :action="`${axios.defaults.baseURL}/api/upload/fileUpload`"
                            :on-change="handleChange"
                            :on-remove="handleRemove"
                            :file-list="resourceList">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="formVisible = false">取 消</el-button>
                    <el-button type="primary" @click="!courseId ? handleAdd() : handlePut()">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { getAllCourse, addCourse, getCourseDetail, deleteCourse, updateCourse, addRecommend, deleteRecommend } from '@/api/index'

export default {
    data(){
        return {
            pageQuery: {
                page: 1,
                size: 10
            },
            courseTotal: 0,
            courseList: [],
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
            progressPercentage: 0,
            imageUrl: ''
        }
    },
    created(){
        this.fetchCourseList();
    },
    watch: {
        formVisible(val) {
            if(val) 
                this.formData.resourceUrlList = [];
        }
    },
    methods: {
        async fetchCourseList(){    // 获取列表
            let {data: res} = await getAllCourse(this.pageQuery);
            if(res.success) {
                console.log(res);
                this.courseTotal = res.data.totalCount;
                this.courseList = res.data.list;
            }
        },
        async handleEdit(id){
            this.courseId = id;
            // console.log(id);
            let {data: res} = await getCourseDetail(id);
            this.formVisible = true;
            this.$nextTick(() => {
                console.log(res);
                if(res.success) this.formData = res.detail;
            })
        },
        handleDelete(id){
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
            this.formData.id = this.courseId;
            let { name, introduction, pictureUrl, videoUrl } = this.formData
            if( !name || !introduction || !pictureUrl || !videoUrl ) {
                this.$message.error('请将必填项填完后再提交')
                return
            }
            console.log('resourceUrlList', this.formData.resourceUrlList);
            let {data: res} = await updateCourse(this.formData);
            if(res.success) this.afterSuccessHandle(res.message)
            else this.$message.error(res.message)
        },
        async handleRecommend(judge, id){
            let action = judge ? addRecommend : deleteRecommend;
            let {data: res} = await action(id);
            console.log(res)
            if(res.success)
                this.afterSuccessHandle(res.message)
            else {
                this.$message.error(res.message)
                this.fetchCourseList() && (this.formVisible = false);
            }
            
        },
        handleChange(file, fileList) {
            this.resourceList = fileList.slice(-3);
            this.resourceList.forEach(item => {
                if(item.status == 'success') {
                    if(!this.formData.resourceUrlList) this.formData.resourceUrlList = []
                    this.formData.resourceUrlList.push(item.response.fileUrl);
                    console.log(this.formData.resourceUrlList);
                    this.$message.success('上传成功')
                }
            })
        },
        handleRemove(file, fileList) {
            this.resourceList = fileList.slice(-3);
            if(file.status == 'success') {
                let index = this.formData.resourceUrlList.indexOf(file.response.fileUrl)
                if (index > -1) this.formData.resourceUrlList.splice(index, 1);
                else return
            }
        },
        afterSuccessHandle(msg){
            this.fetchCourseList() && (this.formVisible = false);
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
    width: 100px;
    height: 50px;
}
</style>
