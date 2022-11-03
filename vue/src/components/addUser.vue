<template>
  <div class="login">
    <h1>加入排行榜</h1>
    <form>
      <div>
        <div>力扣ID</div>
        <input type="text" id="leetcode" v-model="leetcode" />
      </div>
      <div>
        <div>昵称</div>
        <input type="text" id="name" v-model="name" />
      </div>
    </form>

    <div
      style="
        margin-top: 20px;
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-self: center;
      "
    >
      <input type="submit" value="提交" @click="infoConfirmed" class="but" />
      <input type="submit" value="返回" @click="toHome" class="but" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import httpRequest from "@/api/index";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const leetcode = ref("");
    const name = ref("");

    const router = useRouter();
    const toHome = () => {
      router.push({
        name: "home",
      });
    };

    const infoConfirmed = () => {
      var obj = {
        name: name.value,
        leet_id: leetcode.value,
      };
      httpRequest({
        url: "/user/sign/new",
        method: "post",
        data: JSON.stringify(obj),
      }).then((res) => {
        if (res.status == 400) {
          ElMessage.error(res.data);
        } else {
          ElMessage.success('添加成功');
          toHome();
        }
      });
    };
    return {
      toHome,
      infoConfirmed,
      leetcode,
      name,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  height: 90%;
}

.login {
  width: 60%;
  padding: 50px 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  box-shadow: 0 0 10px #fff;
}

input {
  background-color: transparent;
  border: none;
  border-bottom: white 1px solid;
  width: 100%;
  font-size: 20px;
  color: #fff;
  padding-left: 10px;
}

.but {
  width: 140px;
  background-color: transparent;
  border: #fff 2px solid;
  height: 40px;
  border-radius: 5px;
  font-weight: 600;
  margin-top: 20px;
  font-size: 16px;

  color: #fff;
  margin: 20px 20px 0 20px;
  text-align: center;
}

form {
  width: 100%;
  font-size: 20px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

form div {
  text-align: left;
  width: 70%;
  margin: 20px 0;
}
</style>
