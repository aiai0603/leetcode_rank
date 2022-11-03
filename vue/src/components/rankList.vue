
<template>
  <div style="height: 100%; width: 100%">
    <div class="header">
      <div>
        <h1>卷王群LEETCODE排行榜</h1>
      </div>
      <div>
        <a href="https://github.com/aiai0603/leetcode_rank" target="blank" style="cursor:pointer;color: white;text-decoration: none;">开源地址</a>
        <div @click="toSign" class="but">加入排行榜</div>
      </div>
    </div>
    <div class="main">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
        :default-sort="{ prop: 'rank', order: 'descending' }"
      >
        <el-table-column type="index" width="50" />
        <el-table-column label="昵称">
          <template #default="scope">
            <div
              style="
                display: flex;
                flex-wrap: nowrap;
                width: 100%;
                align-items: center;
              "
            >
              <a
                :href="
                  'https://clist.by/account/' +
                  scope.row.leet +
                  '/resource/leetcode.com/'
                "
                target="blank"
              >
                <img
                  src="../../public/image/Knight_lg.png"
                  alt=""
                  srcset=""
                  v-if="scope.row.medal && scope.row.medal.name == 'Knight'"
                  class="media"
                />
                <img
                  src="../../public/image/Guardian_lg.png"
                  alt=""
                  srcset=""
                  v-if="scope.row.medal && scope.row.medal.name == 'Guardian'"
                  class="media"
                />
              </a>
              <a
                :href="'https://leetcode.cn/u/' + scope.row.leet"
                target="blank"
              >
                {{ scope.row.name }}
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" sortable label="分数" />
        <el-table-column label="全国排名 / 全球排名">
          <template #default="scope">
            {{ scope.row.local }} / {{ scope.row.globa }}
          </template>
        </el-table-column>
        <el-table-column
          prop="language"
          label="擅长语言"
          :filters="[
            { text: 'C++', value: 'C++' },
            { text: 'Golang', value: 'Golang' },
            { text: 'Java', value: 'Java' },
            { text: 'JavaScript', value: 'JavaScript' },
            { text: 'Python', value: 'Python' },
            { text: 'C', value: 'C' },
          ]"
          :filter-method="filterTag"
        />
        <el-table-column prop="steak" sortable label="连续打卡" />
        <el-table-column sortable label="解题数量" prop="sum">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>easy: {{ scope.row.easy }}</div>
                <div>medium: {{ scope.row.medium }}</div>
                <div>hard: {{ scope.row.hard }}</div>
              </template>
              <template #reference>
                {{ scope.row.sum }}
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import httpRequest from "@/api/index";
export default {
  setup() {
    const loading = ref(true);

    const router = useRouter();
    const toSign = () => {
      router.push({
        name: "sign",
      });
    };
    const filterTag = (value, row) => {
      return row.language === value;
    };

    const tableData = reactive([]);

    onMounted(() => {
      loading.value = true;
      httpRequest({
        url: "/user/all",
        method: "get",
      }).then(async (res) => {
        if (res.status == 400) {
          ElMessage.error(res.data);
        } else {
          for (let i = 0; i < res.data.length; i++) {
            let obj = {};
            obj.leet = res.data[i].leet_id;
            obj.name = res.data[i].name;
            await get_content(res.data[i].leet_id).then((res) => {
              if (res.data == null || res.data.userContestRanking == null) {
                obj.rank = 1500;
                obj.medal = null;
                obj.local = "-";
                obj.globa = "-";
              } else {
                obj.rank = Math.round(res.data.userContestRanking.rating);
                obj.medal = res.data.userProfileUserLevelMedal.current;
                obj.globa = res.data.userContestRanking.globalRanking;
                obj.local = res.data.userContestRanking.localRanking;
              }
            });

            await get_steak(res.data[i].leet_id).then((res) => {
              if (res.data == null || res.data.userCalendar == null) {
                obj.steak = 0;
              } else {
                obj.steak = res.data.userCalendar.streak;
              }
            });

            await get_language(res.data[i].leet_id).then((res) => {
              if (res.data == null || res.data.userLanguageProblemCount == null) {
                obj.language = "-";
              } else {
                obj.language = res.data.userLanguageProblemCount.sort(
                  (a, b) => {
                    return b.problemsSolved - a.problemsSolved;
                  }
                )[0].languageName;
              }
            });

            await get_ques(res.data[i].leet_id).then((res) => {
              if (res.data == null || res.data.userProfileUserQuestionProgress.numAcceptedQuestions.length == 0) {
                obj.easy = 0;
                obj.medium = 0 ;
                obj.hard = 0;
              } else {
                obj.easy =
                  res.data.userProfileUserQuestionProgress.numAcceptedQuestions[0].count;
                obj.medium =
                  res.data.userProfileUserQuestionProgress.numAcceptedQuestions[1].count;
                obj.hard =
                  res.data.userProfileUserQuestionProgress.numAcceptedQuestions[2].count;
              }
              obj.sum = obj.easy + obj.medium + obj.hard;
            });

            console.log(obj);
            tableData.push(obj);
          }
          loading.value = false;
        }
      });
    });

    const get_content = async (id) => {
      var obj = {
        query:
          "\n    query userContestRankingInfo($userSlug: String!) {\n  userContestRanking(userSlug: $userSlug) {\n  rating\n   localRanking\n  globalRanking\n  topPercentage\n  }\n     " +
          " userProfileUserLevelMedal(userSlug: $userSlug) {\n    current {\n      name\n       }\n   }\n     }\n",
        variables: { userSlug: id },
      };

      return httpRequest({
        url: "/graphql/noj-go/",
        method: "post",
        data: JSON.stringify(obj),
      });
    };

    const get_steak = async (id) => {
      var obj = {
        query:
          "\n    query userProfileCalendar($userSlug: String!, $year: Int) {\n  userCalendar(userSlug: $userSlug, year: $year) {\n    streak\n    }\n}\n    ",
        variables: { userSlug: id },
      };
      return httpRequest({
        url: "/graphql/noj-go",
        method: "post",
        data: JSON.stringify(obj),
      });
    };

    const get_language = async (id) => {
      var obj = {
        query:
          "\n    query languageStats($userSlug: String!) {\n  userLanguageProblemCount(userSlug: $userSlug) {\n    languageName\n    problemsSolved\n  }\n}\n    ",
        variables: { userSlug: id },
      };
      return httpRequest({
        url: "/graphql/noj-go",
        method: "post",
        data: JSON.stringify(obj),
      });
    };

    const get_ques = async (id) => {
      var obj = {
        query:
          "\n    query userQuestionProgress($userSlug: String!) {\n  userProfileUserQuestionProgress(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      difficulty\n      count\n    }\n     }\n}\n    ",
        variables: { userSlug: id },
      };
      return httpRequest({
        url: "/graphql/",
        method: "post",
        data: JSON.stringify(obj),
      });
    };

    return {
      tableData,
      toSign,
      get_content,
      get_steak,
      get_language,
      get_ques,
      filterTag,
      loading,
    };
  },
};
</script>


<style scoped>
.media {
  width: 20px;
  height: 20px;
  margin: 0 5px;
}
.but {
  width: 100px;
  height: 30px;
  background-color: transparent;
  border: #fff 2px solid;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: 600;
  margin: 0 20px;

  color: #fff;

  text-align: center;
}

h1 {
  margin: 10px 30px;
}

.header {
  width: 100%;
  border-bottom: 1px white solid;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);

  box-shadow: 0, 0, 0, 0 0 10px #fff;
}

.header div {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.main {
  width: 100%;
  display: flex;
  flex-flow: row;
}

.right {
  border-left: 2px white solid;
  flex: 1;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;

  padding-bottom: 50px;
}

.right h1 {
  margin: 30px;
}

#rc {
  text-align: center;
  border-bottom: #fff 2px solid;
}
#rc thead {
  font-size: 20px;
  border-bottom: #fff 1px solid;
}
#rc td {
  padding: 10px;
}
#rank {
  text-align: center;
}
#rank thead {
  font-size: 20px;
  border-bottom: #fff 1px solid;
}
#rank td {
  padding: 10px;
}
</style>
