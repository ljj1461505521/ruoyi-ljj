<template>
  <div class="component-upload-image">
    <el-upload
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :on-remove="removeImage"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="showFileList"
      :headers="headers"
      :limit="limit"
       :file-list="fileList"
      style="display: inline-block; vertical-align: top"
    >
      <el-image v-if="showFileList" :src="value">
        <div slot="error" class="image-slot">
          <i class="el-icon-plus" />
        </div>
      </el-image>
      <template v-else>
        <el-image v-if="!value" :src="value">
          <div slot="error" class="image-slot">
            <i class="el-icon-plus" />
          </div>
        </el-image>
        <div v-else class="image">
          <el-image :src="value" :style="`width:150px;height:150px;`" fit="fill" />
          <div class="mask">
            <div class="actions">
              <span title="预览" @click.stop="dialogVisible = true">
                <i class="el-icon-zoom-in" />
              </span>
              <span title="移除" @click.stop="removeImage">
                <i class="el-icon-delete" />
              </span>
            </div>
          </div>
        </div>
      </template>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="value" style="display: block; max-width: 100%; margin: 0 auto;" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import server from "@/config/server";
export default {
  data() {
    return {
      dialogVisible: false,
      uploadImgUrl: server.src + "/common/file/upload/form", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken()
      }
    };
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 10
    },
    fileList:{
        type:Array,
        default:()=>[]
    }
  },
  methods: {
    removeImage(file, fileList) {
      this.$emit("on-remove", file, fileList);
    },
    handleUploadSuccess(response, file, fileList) {
      this.$emit("on-success", response, fileList);
      this.loading.close();
    },
    handleBeforeUpload() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败"
      });
      this.loading.close();
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
.image {
  position: relative;
  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  &:hover .mask {
    opacity: 1;
  }
}

</style>