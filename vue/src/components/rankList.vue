
<template>
  <div style="height: 100%; width: 100%; display: flex; flex-flow: column">
    <div class="header">
      <div>
        <h1>卷王群LEETCODE排行榜</h1>
      </div>
      <div>
        <a
          href="https://github.com/aiai0603/leetcode_rank"
          target="blank"
          style="cursor: pointer; color: white; text-decoration: none"
          >开源地址</a
        >
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
        <el-table-column prop="max" sortable label="最高分数" />
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
        <el-table-column prop="steak" sortable label="连续打卡">
          <template #default="scope">
            <div class="steak">
              {{ scope.row.steak }}
              <svg
                v-if="scope.row.steak > 0"
                class="steak-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
              >
                <g filter="url(#hot-filled_svg__filter0_i_289_12318)">
                  <path
                    fill-rule="evenodd"
                    d="M9.588 2.085a1 1 0 01.97.092c2.85 1.966 4.498 4.744 5.31 6.67l.854-.885a1 1 0 011.56.154c2.177 3.38 2.211 7.383.521 10.3C17.039 21.459 13.583 22 11.977 22c-1.569 0-4.905-.27-6.825-3.584-.832-1.435-1.27-3.053-1.125-4.704.146-1.66.876-3.284 2.264-4.721.86-.891 1.505-2.122 1.957-3.322.449-1.193.68-2.278.752-2.806a1 1 0 01.588-.778z"
                    clip-rule="evenodd"
                    fill="url(#hot-filled_svg__paint0_linear_289_12318)"
                  ></path>
                </g>
                <defs>
                  <linearGradient
                    id="hot-filled_svg__paint0_linear_289_12318"
                    x1="12"
                    x2="12"
                    y1="2"
                    y2="22"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#FFA116"></stop>
                    <stop offset="1" stop-color="#F9772E"></stop>
                  </linearGradient>
                  <filter
                    id="hot-filled_svg__filter0_i_289_12318"
                    width="17.2"
                    height="21.2"
                    x="4"
                    y="2"
                    color-interpolation-filters="sRGB"
                    filterUnits="userSpaceOnUse"
                  >
                    <feFlood
                      flood-opacity="0"
                      result="BackgroundImageFix"
                    ></feFlood>
                    <feBlend
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    ></feBlend>
                    <feColorMatrix
                      in="SourceAlpha"
                      result="hardAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    ></feColorMatrix>
                    <feOffset dx="1.2" dy="1.2"></feOffset>
                    <feGaussianBlur stdDeviation="0.6"></feGaussianBlur>
                    <feComposite
                      in2="hardAlpha"
                      k2="-1"
                      k3="1"
                      operator="arithmetic"
                    ></feComposite>
                    <feColorMatrix
                      values="0 0 0 0 0.970833 0 0 0 0 0.05825 0 0 0 0 0 0 0 0 0.16 0"
                    ></feColorMatrix>
                    <feBlend
                      in2="shape"
                      result="effect1_innerShadow_289_12318"
                    ></feBlend>
                  </filter>
                </defs>
              </svg>
            </div>
          </template>
        </el-table-column>
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
          let pro = [];
          for (let i = 0; i < res.data.length; i++) {
            let t = new Promise((resolve, reject) => {
              let obj = {};
              obj.leet = res.data[i].leet_id;
              obj.name = res.data[i].name;

              Promise.all([
                get_content(res.data[i].leet_id),
                get_steak(res.data[i].leet_id),
                get_language(res.data[i].leet_id),
                get_ques(res.data[i].leet_id),
              ]).then((res) => {
                if (
                  res[0].data == null ||
                  res[0].data.userContestRanking == null
                ) {
                  obj.rank = 1500;
                  obj.medal = null;
                  obj.local = "-";
                  obj.globa = "-";
                  obj.max = 1500;
                } else {
                  obj.rank = Math.round(res[0].data.userContestRanking.rating);
                  obj.medal = res[0].data.userProfileUserLevelMedal.current;
                  obj.globa = res[0].data.userContestRanking.globalRanking;
                  obj.local = res[0].data.userContestRanking.localRanking;
                  obj.max = Math.round(res[0].data.userContestRankingHistory.sort(
                    (a, b) => {
                      return b.rating - a.rating;
                    }
                  )[0].rating);
                }

                if (res[1].data == null || res[1].data.userCalendar == null) {
                  obj.steak = 0;
                } else {
                  let y = new Date().getFullYear();
                  let m = new Date().getMonth() + 1;
                  let d = new Date().getDate();

                  let steak = sum_streak(
                    JSON.parse(res[1].data.userCalendar.submissionCalendar),
                    new Date(
                      Date.parse(y + "/" + m + "/" + d + " 8:0:0")
                    ).getTime() / 1000
                  );

                  obj.steak = steak;
                }

                if (
                  res[2].data == null ||
                  res[2].data.userLanguageProblemCount == null
                ) {
                  obj.language = "-";
                } else {
                  obj.language = res[2].data.userLanguageProblemCount.sort(
                    (a, b) => {
                      return b.problemsSolved - a.problemsSolved;
                    }
                  )[0].languageName;
                }

                if (
                  res[3].data == null ||
                  res[3].data.userProfileUserQuestionProgress
                    .numAcceptedQuestions.length == 0
                ) {
                  obj.easy = 0;
                  obj.medium = 0;
                  obj.hard = 0;
                } else {
                  obj.easy =
                    res[3].data.userProfileUserQuestionProgress.numAcceptedQuestions[0].count;
                  obj.medium =
                    res[3].data.userProfileUserQuestionProgress.numAcceptedQuestions[1].count;
                  obj.hard =
                    res[3].data.userProfileUserQuestionProgress.numAcceptedQuestions[2].count;
                }
                obj.sum = obj.easy + obj.medium + obj.hard;
                resolve(obj);
                reject("error");
              });
            });

            pro.push(t);
          }

          Promise.all(pro).then((res) => {
            for (let i = 0; i < res.length; i++) {
              tableData.push(res[i]);
            }
            loading.value = false;
          });
        }
      });
    });

    const gap = 1667952000 - 1667865600;
    const sum_streak = (calendar, now) => {
      let cnt = 0;

      while (typeof calendar[now] != "undefined") {
        cnt++;
        now -= gap;
      }
      return cnt;
    };

    const get_content = async (id) => {
      var obj = {
        query:
          "\n    query userContestRankingInfo($userSlug: String!) {\n  userContestRanking(userSlug: $userSlug) {\n  rating\n   localRanking\n  globalRanking\n  topPercentage\n  }\n     " +
          " userProfileUserLevelMedal(userSlug: $userSlug) {\n    current {\n      name\n       }\n   }\n   " +
          " userContestRankingHistory(userSlug: $userSlug) {\n       rating\n       }\n  }\n",
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
          "\n    query userProfileCalendar($userSlug: String!, $year: Int) {\n  userCalendar(userSlug: $userSlug, year: $year) {\n    submissionCalendar\n    }\n}\n    ",
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
.steak {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
}

.steak-logo {
  width: 24px;
  height: 24px;
  margin-left: 5px;
}
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
  font-size: 14px;
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
  flex: 1;
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
