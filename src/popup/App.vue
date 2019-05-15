<template>
    <div id="app">
        <el-form ref="form" :model="form" label-width="80px">
            <el-input v-model="form.token" placeholder="请输入Token"></el-input>
            <div class="tools">
                <el-button type="primary" @click="onSaveToken">保存Token</el-button>
                <el-button type="danger" @click="onRemoveToken">删除Token</el-button>
                <el-button type="info" @click="initData">初始化数据</el-button>
            </div>
            
        </el-form>
        <el-card class="box-card" v-if="initFlag">
            当前用户：{{userinfo.name}} <br>
            Book: <el-select v-model="book" placeholder="请选择" @change="selectChange">
                    <el-option
                    v-for="item in books"
                    :key="item.slug"
                    :label="item.name"
                    :value="item.slug">
                    </el-option>
                </el-select>
        </el-card>
    </div>
</template>
<script>
import {getData,setData, removeData} from '../utils'
import { constants } from 'crypto';
let userinfoDefault = {
    name: '默认'
}
export default {
    name: 'app',
    data(){
        return {
            form:{
                token: ''
            },
            userinfo: userinfoDefault,
            key:'',
            initFlag: false,
            books:[],
            book:''
        }
    },
    computed:{
        headers() {
            return {
                'X-Auth-Token': this.form.token,
                'Content-Type': 'application/json'
            }
        }
    },
    mounted(){
        // 读取本地的token
        this.form.token = getData('token') || ''
        this.userinfo = getData('userinfo') || userinfoDefault
        this.book = getData('currentBook').slug || ''
        if (this.form.token && this.userinfo.id && this.book) {
            this.initData()
        }
    },
    methods:{
        showSuccessNotify(title, message) {
            this.$notify({
                title: title,
                type:'success',
                message: message
            });
        },
        showErrorNotify(title, message) {
            this.$notify({
                title: title,
                type:'error',
                message: message
            });
        },
        showInfoNotify(title, message) {
            this.$notify({
            title: title,
            message: message
            });
        },
        // 保存token
        onSaveToken(){
            if(!this.form.token) {
                this.showInfoNotify('token','请先输入Token')
                return
            }
            setData('token', this.form.token)
            this.showSuccessNotify('token', '保存成功')
        },
        // 清空 token
        onRemoveToken() {
            removeData('token')
            this.form.token = ''
            this.showSuccessNotify('token', '删除Token成功')
        },
        initData() {
            this.$axios.get('/user',{
                headers:this.headers
            }).then((res) => {
                var userinfo = res.data.data
                // 保存用户信息
                setData('userinfo', userinfo)
                return userinfo
            }).then((userinfo) => {
                this.$axios.get(`/users/${userinfo.id}/repos`,{
                    headers:this.headers,
                    params:{
                        type:'all'
                    }
                }).then((res) => {
                    this.books = res.data.data
                    this.showSuccessNotify('init', '初始化完成')
                    this.initFlag = true
                })
            }).catch((err) => {
                this.showErrorNotify('error', '初始化数据失败')
            })
        },
        selectChange(slug) {
            var selectbooks = this.books.filter((item) => {
                return item.slug === slug
            })
            setData('currentBook', selectbooks[0])
        },
        search() {
            this.$axios.get('/search/repos',{
                params:{
                    q:this.key,
                    type:'Book'
                },
                headers:this.headers
            }).then((res) => {
                console.log(res.data)
            })
        }
    }
}
</script>
<style scoped>
#app {
    width: 420px;
    min-height: 500px;
}
.tools {
    text-align: center;
    margin: 10px 0;
}
.text {
font-size: 16px;
}
.item {
padding: 18px 0;
}
.box-card {
    width: 100%;
}
</style>