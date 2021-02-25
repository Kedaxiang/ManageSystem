<template>
    <div class="orders">
        <el-card>
            <el-button type="primary" style="margin-bottom: 20px;" @click="()=>{adId = null; formVisible = true}">添加轮播图</el-button>
            <el-table
                :data="adList"
                style="width: 100%;margin-bottom: 20px;"
                border>
                <el-table-column
                    prop="id"
                    label="轮播图ID"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="courseId"
                    label="跳转课程ID"
                    width="120">
                    <template slot-scope="scope" v-if="scope.row.goodsId != 0">
                        {{scope.row.courseId}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="isShow"
                    label="是否显示"
                    width="120">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isShow" @change="handleIsShow(scope.row.id)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="picturePath"
                    label="图片"
                    width="180">
                    <template slot-scope="scope">
                        <img :src="scope.row.photoUrl" class="picture">
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination 
                layout="total, prev, pager, next" 
                :total="adTotal" 
                :page-size="pageQuery.size"
                background
                @current-change="($event) => { pageQuery.page = $event; fetchAdList()}">
            </el-pagination>

            <el-dialog :title="`${!adId ? '添加' : '编辑'}轮播图`" :visible.sync="formVisible" @close="$refs['formData'].resetFields()">
                <el-form :model="this" ref="formData" label-width="130px">
                    <el-form-item label="轮播图ID: " prop="adId" v-if="adId">
                        <el-input v-model="adId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转课程ID：" prop="courseId">
                        <el-input v-model="courseId"></el-input>
                    </el-form-item>
                    <el-form-item label="上传轮播图图片" prop="photoUrl">
                        <el-upload
                            class="avatar-uploader"
                            :action="`${axios.defaults.baseURL}/api/upload/singlePhotoUpload`"
                            :show-file-list="false"
                            :on-progress="uploadProgress"
                            :on-success="res => {formData.photoUrl = res.imageUrl; isUpload = false}">
                            <el-progress v-if="isUpload" type="circle" :percentage="progressPercentage" :width="160" style="display:block"></el-progress>
                            <img v-else-if="photoUrl" :src="photoUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="formVisible = false">取 消</el-button>
                    <el-button type="primary" @click="!adId ? handleAdd() : handlePut()">确 定</el-button>
                </div>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import { addCarousel, getAllCarousel, putCarousel, putCarouselShow, deleteCarousel } from '@/api/index'

export default {
    data(){
        return {
            pageQuery: {
                page: 1,
                size: 10
            },
            adTotal: 0,
            adList: [],
            formVisible: false,
            formData: {
                id: 0,
                courseId: 0,
                photoUrl: '',
                isShow: true,
            },
            adId: null,
            courseId: null,
            isUpload: false,
            photoUrl: '',
            progressPercentage: 0
        }
    },
    created(){
        this.fetchAdList();
    },
    methods: {
        async fetchAdList(){    // 获取列表
            let {data: res} = await getAllCarousel(this.pageQuery);
            console.log(res)
            if(res.success) {
                this.adTotal = res.data.totalCount;
                this.adList = res.data.list
            }
        },
        handleEdit(item){
            console.log(item);
            [this.adId, this.courseId, this.photoUrl] = [item.id, item.courseId, item.photoUrl]
            // this.adId = id;
            this.formVisible = true;
        },
        handleDelete(id){
            this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data: res} = await deleteCarousel(id)
                console.log(res);
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
            let {data: res} = await addCarousel(this.formData.photoUrl)
            console.log(res)
            if(res.success)
                this.afterSuccessHandle(res.message)
        },
        async handlePut(){
            let {data: res} = await putCarousel(this.adId, this.courseId);
            console.log(res)
            if(res.success)
                this.afterSuccessHandle(res.message)
        },
        async handleIsShow(id){
            let {data: res} = await putCarouselShow(id);
            console.log(res)
            if(res.success)
                this.afterSuccessHandle(res.message)
        },
        afterSuccessHandle(msg){
            this.fetchAdList() && (this.formVisible = false);
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
