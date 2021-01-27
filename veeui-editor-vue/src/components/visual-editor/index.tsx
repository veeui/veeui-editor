import { defineComponent } from 'vue';
import './index.scss';

const VisualEditor = defineComponent({
    props: {},
    setup(props) {
        return () => (
            <div class="visual-editor">
                <div class="visual-editor-menu">
                    menu
                </div>
                <div class="visual-editor-head">
                    head
                </div>
                <div class="visual-editor-operator">
                    operator
                </div>
                <div class="visual-editor-body">
                    <div class="visual-editor-content">
                    body
                    </div>
                </div>
            </div>
        )
    }
});

export default VisualEditor;