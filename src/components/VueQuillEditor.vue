<template>
  <div>
    <quill-editor 
      v-model="content" 
      ref="myQuillEditor" 
      :options="editorOption" 
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
    </quill-editor>

    <van-button
      type="primary"
      @click="saveHtml"
      style="margin: 15px 0; width: 95vw; margin-left: 2.5vw"
    >确定</van-button>

    <van-uploader :after-read="afterRead" style="display: none"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { addActivityImage } from '@/api/activity';

  import VueQuillEditor from 'vue-quill-editor';
  import { Button, Uploader } from 'vant';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  
  Vue.use(VueQuillEditor).use(Button).use(Uploader);

  export default {
    name: 'VueQuillEditor',
    props: {
      activityContent: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        content: '',
        editorOption: {},
        editorOption: {
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                ['image'],
              ],
              handlers: {
                  image: (value) => {
                      if (value) {
                          document.querySelectorAll('.van-uploader__input')[1].click();
                      } else {
                          this.quill.format('image', false);
                      }
                  }
              }
            }
          },
          theme: 'snow'
        }
      };
    },

    methods: {
      onEditorReady(editor) {}, // 准备编辑器
      onEditorBlur() {}, // 失去焦点事件
      onEditorFocus() {}, // 获得焦点事件
      onEditorChange() {}, // 内容改变事件
      saveHtml(event) {
        this.$emit('func', this.content);
      },

      async afterRead(file) {
        const quill = this.$refs.myQuillEditor.quill;
        const data = new FormData();
        data.append('file', file.file);
        const res = await addActivityImage(data);
        const length = quill.getSelection().index;
        quill.insertEmbed(length, 'image', res.data.data.url);
        quill.setSelection(length + 1);
      }
    },
    created() {
      this.content = this.activityContent;
    }
  };
</script>

<style>
.ql-editor {
  min-height: 250px;
}
</style>