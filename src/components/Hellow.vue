<template>
    <div class="box">
        <p> <img  src="../assets/timg.jpg"/></p>
        <h1 class="h1">Welcome To</h1>
        <p class="p">后台管理系统</p>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
    .box{
        width: 400px;
        text-align: center;
        position: absolute;
        left: 40%;
        top: 40%;
        transform: translate(-50%,-50%);
        img{
            width: 130px;
            height: 130px;
            border-radius: 50%;
            box-shadow: 1px 4px #409eff;
        }
    }
    .h1{
        font-size: 50px;
        color: #409eff;
        margin: 10px;
        box-shadow: 4px 4px #fe0000;
        padding: 15px;
        border-radius: 50%;
    }
    .p{
        color:#409eff;
        font-size: 26px;
        font-weight:bold;
        margin: 40px;
        box-shadow: 4px 4px #fe0000;
        padding: 15px 2px;
        letter-spacing: 5px;
        border-radius: 50%;
    }
</style>
