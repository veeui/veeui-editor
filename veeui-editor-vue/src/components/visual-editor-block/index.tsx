import { computed, defineComponent, PropType, ref } from "vue";
import './index.scss';
import { VisualEditorBlockData } from '@/components/index.d.ts';
import { VisualConfig } from '../index.utils';

const VisualEditorBlock = defineComponent({
    props: {
        block: {
            type: Object as PropType<VisualEditorBlockData>, 
            required: true
        },
        config: {
            type: Object as PropType<VisualConfig>,
            required: true
        }
    },
    setup(props) {
        const el = ref({} as HTMLDivElement);

        const classes = computed(() => [
            'visual-editor-block',
            {
                'visual-editor-block-focus': props.block.focus
            }
        ])

        const styles = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`
        }));

        return () => {
            const component = props.config.componentMap[props.block.componentKey];
            const Render = component.render();
            return (
                <div class={classes.value} style={styles.value} ref={el}>
                    {Render}
                </div>
            )
        }
    }
});

export default VisualEditorBlock;