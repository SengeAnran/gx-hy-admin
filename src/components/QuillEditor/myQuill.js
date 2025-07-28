// 引入核心样式和主题样式
import Quill from 'quill'
// 引入源码中的BlockEmbed
const BlockEmbed = Quill.import('blots/block/embed');
import { ContainerBlot, ScrollBlot, EmbedBlot } from 'parchment';

class UniversalBlock extends ContainerBlot {
  static blotName = 'universal-block';
  static tagName = 'div';
  static className = 'ql-universal-block';

  static create(value) {

    const node = super.create();
    console.log(node)
    // node.setAttribute('cellspacing', 0);
    // node.setAttribute('contenteditable', 'false');
    node.setAttribute('width', '100%');
    // node.setAttribute('data-block-id', value.id || '1');
    // node.setAttribute('data-block-type', value.type || 'generic');
    return node;
  }
  static transformValue(value) {
    // console.log(value)
    // let handleArr = value.split('\n')
    // handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
    //   .replace(/[\s]+$/, ''))
    // return handleArr.join('')
    return value
  }

  static formats(domNode) {
    return {
      // id: domNode.getAttribute('data-block-id'),
      // type: domNode.getAttribute('data-block-type')
    };
  }

  // 允许所有类型的子Blot
  static allowedChildren = null; // null表示允许所有类型

  // 分块边界处理
  optimize(context) {
    super.optimize(context);
    // 确保分块之间总有换行
    if (!(this.next instanceof UniversalBlock)) {
      this.appendChild(ScrollBlot.create('block'));
    }
  }

}
// 引入源码中的BlockEmbed
// 定义新的blot类型
// const BlockEmbed = Quill.import('blots/embed');
// 定义新的blot类型
class AppPanelEmbed extends BlockEmbed {
  static create(value) {
    console.log('create',value);
    const node = super.create(value);
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('width', '100%');
    //   设置自定义html
    node.innerHTML = this.transformValue(value)
    return node;
  }

  static transformValue(value) {
    // let handleArr = value.split('\n')
    // handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
    //   .replace(/[\s]+$/, ''))
    return value
  }

  // 返回节点自身的value值 用于撤销操作
  static value(node) {
    return node.innerHTML
  }
}
// blotName
AppPanelEmbed.blotName = 'AppPanelEmbed';
// class名将用于匹配blot名称
AppPanelEmbed.className = 'embed-innerApp';
// 标签类型自定义
AppPanelEmbed.tagName = 'div';
class ContentBlock extends EmbedBlot {

  static create(value) {
    console.log('create',value)
    const node = super.create();
    node.setAttribute('class', 'ql-content-block');
    node.setAttribute('data-block-id', value.id);
    // node.setAttribute('style', 'display:none');
    return node;
  }

  // static value(node) {
  //   return {
  //     id: node.getAttribute('data-block-id')
  //   };
  // }
}

ContentBlock.blotName = 'content-block';
ContentBlock.tagName = 'span';
ContentBlock.className = 'ql-content-block';
// // blotName
// ContentBlock.blotName = 'content-block';
// // class名将用于匹配blot名称
// ContentBlock.className = 'ql-content-block';
// // 标签类型自定义
// ContentBlock.tagName = 'div';
export default {UniversalBlock, AppPanelEmbed}
