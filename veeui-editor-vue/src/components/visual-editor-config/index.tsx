import { createVisualConfig } from "@/components/index.utils";

const VisualEditorConfig = createVisualConfig();

VisualEditorConfig.registry('text', {
    key: 'text',
    label: '文本',
    preview: () => '预览文本',
    render: () => '渲染文本'
});

VisualEditorConfig.registry('button', {
    key: 'button',
    label: '按钮',
    preview: () => <button>预览按钮</button>,
    render: () => <button>渲染按钮</button>
});

VisualEditorConfig.registry('input', {
    key: 'input',
    label: '输入框',
    preview: () => <input placeholder="这是一个预览输入框"/>,
    render: () => <input placeholder="这是一个渲染输入框"/>
});

 export default VisualEditorConfig;
