<template>
  <div>
    <el-dialog :visible.sync="show" width="700px" :close-on-click-modal="false" :before-close="closePopup">
      <el-descriptions class="margin-top" title="基本信息" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            <span>用户ID：</span>
          </template>
          <span>{{ assetInfo?.userId }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>平台：</span>
          </template>
          <span>{{ assetInfo?.businessesName }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>注册时间：</span>
          </template>
          <span>{{ timeForStr(assetInfo?.registrationTime, "YYYY-MM-DD HH:mm:ss") }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <span>最后账变时间：</span>
          </template>
          <span>{{ timeForStr(assetInfo?.accountChangeTime || "", "YYYY-MM-DD HH:mm:ss") }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <div class="assets-box">
        <div class="assets-item">
          <div class="title">总用户</div>
          <div class="val">1111</div>
        </div>
        <div class="assets-item">
          <div class="title">总资产</div>
          <div class="val">
            <span>{{ `$${assetInfo?.totalAssets}` }}</span>
            <i class="icon el-icon-refresh"></i>
          </div>
        </div>
      </div>
      <el-descriptions class="margin-top" title="资产信息" :column="2" border>
        <el-descriptions-item v-for="(item, index) in assetInfo?.assetsVOS" :key="index">
          <template slot="label">
            <div class="assets-label">
              <img src="" class="coin-img" />
              <div class="coin-box">
                <div class="coin">{{ item.coinName }}</div>
                <div class="value">{{ `$${item.value}` }}</div>
              </div>
            </div>
          </template>
          <div class="coin-box">
            <div class="coin">{{ item.amount }}</div>
            <div class="value">{{ }}</div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>
<script>
import { timeForStr, accurateDecimal } from "@/utils"
export default {
  props: {
    assetInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      show: true
    }
  },
  methods: {
    timeForStr: timeForStr,
    accurateDecimal: accurateDecimal,
    closePopup() {
      this.$emit("closePopup");
    },
  }
}
</script>
<style lang="scss" scoped>
.assets-box {
  margin: 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .assets-item {
    display: flex;
    flex-direction: column;
    width: 50%;
    text-align: left;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      padding-bottom: 8px;
    }

    .val {
      font-size: 14px;
      font-weight: bold;
      color: #F9760D;
    }

    .icon {
      margin-left: 8px;
      font-size: 14px;
      font-weight: bold;
      color: #303133;
    }
  }
}

.assets-label {
  display: flex;
  align-items: center;

  .coin-img {
    width: 40px;
    height: auto;
  }
}

.coin-box {
  .coin {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .value {
    font-size: 14px;
    color: #828080;
  }
}
</style>