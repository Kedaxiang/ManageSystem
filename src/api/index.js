import axios from 'axios'
import Vue from 'vue'

const baseUrl = process.env.API_ROOT || ''
axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true

axios.interceptors.response.use(res => {
    if (res.status == 200) {  // 所有错误的状态码都做统一的异常处理
        // Vue.prototype.$message.success(res.data.message)
    } else {
        Vue.prototype.$message.error(res.data.message)
    }
    return res
}, err => {
    return err
})

Vue.prototype.axios = axios;

// 登录
export let login = data => axios.post('/api/admin/login', {}, { params: data });

// 获取全部课程
export let getAllCourse = pageQuery => axios.get('/api/course/getAll', { params: pageQuery })
// 添加课程
export let addCourse = data => axios.post('/api/course/add', data);
// 更新课程
export let updateCourse = data => axios.put('/api/course/update', data)
// 删除课程
export let deleteCourse = courseId => axios.delete(`/api/course/delete/${courseId}`)
// 添加推荐课程
export let addRecommend = courseId => axios.post('/api/course/addRecommend', {}, { params: { courseId } })
// 删除推荐课程
export let deleteRecommend = recommendId => axios.delete(`/api/course/deleteRecommend/${recommendId}`)
// 查看课程详情
export let getCourseDetail = courseId => axios.get(`/api/course/getDetailBack/${courseId}`)

// 获取所有用户
export let getAllUser = pageQuery => axios.get(`/api/user/getAll`, { params: pageQuery })

// 获取全部轮播图
export let getAllCarousel = pageQuery => axios.get('/api/slideShow/get', { params: pageQuery })
// 上传轮播图
export let addCarousel = url => axios.post('/api/slideShow/add', {}, { params: { photoUrl: url } })
// 删除轮播图
export let deleteCarousel = id => axios.delete(`/api/slideShow/delete/${id}`)
// 修改轮播图的显示状态
export let putCarouselShow = id => axios.put(`/api/slideShow/changeShow/${id}`)
// 修改轮播图详情
export let putCarousel = (slideShowId, courseId) => axios.put(`/api/slideShow/changeCourse/${slideShowId}/${courseId}`)