import { computed, defineComponent, PropType, ref } from 'vue';
import { VisualEditorComponent, VisualEditorModelValue } from '@/components/index.d.ts';
import { VisualConfig } from '@/components/index.utils';
import useModel from '@/utils/useModel';
import './index.scss';
import { VisualEditorBlock } from '@/components';

const VisualEditor = defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<VisualEditorModelValue>,
            required: true
        },
        config: {
            type: Object as PropType<VisualConfig>,
            required: true
        }
    },
    emits: {
        'update:modelValue': (val?: VisualEditorModelValue) => true
    },
    setup(props, ctx) {
        const dataModel = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val));
        const containerRef = ref({} as HTMLDivElement);

        const containerStyles = computed(()=>({
            width: `${dataModel.value.container.width}px`,
            height: `${dataModel.value.container.height}px`
        }));

        const menuDragger = {
            current: {
                component: null as null | VisualEditorComponent
            },
            dragStart: (e: DragEvent, component: VisualEditorComponent) => {
                containerRef.value.addEventListener('dragenter', menuDragger.dragEnter);
                containerRef.value.addEventListener('dragover', menuDragger.dragOver);
                containerRef.value.addEventListener('dragleave', menuDragger.dragLeave);
                containerRef.value.addEventListener('drop', menuDragger.drop);
                menuDragger.current.component = component;
            },
            dragEnter: (e: DragEvent) => {
                e.dataTransfer!.dropEffect = 'move'
            },
            dragOver: (e: DragEvent) => {
                e.preventDefault()
            },
            dragLeave: (e: DragEvent) => {
                e.dataTransfer!.dropEffect = 'none'
            },
            dragEnd: (e: DragEvent) => {
                containerRef.value.removeEventListener('dragenter', menuDragger.dragEnter);
                containerRef.value.removeEventListener('dragover', menuDragger.dragOver);
                containerRef.value.removeEventListener('dragleave', menuDragger.dragLeave);
                containerRef.value.removeEventListener('drop', menuDragger.drop);
                menuDragger.current.component = null;
            },
            drop: (e: DragEvent) => {
                console.log('drop', menuDragger.current.component);
                const blocks = dataModel.value.blocks || [];
                blocks.push({
                    top: e.offsetY,
                    left: e.offsetX,
                    componentKey: menuDragger.current.component!.key
                })
            }
        }

        return () => (
            <div class="visual-editor">
                <div class="visual-editor-menu">
                    {props.config.componentList.map(component => (
                        <div 
                            draggable
                            onDragend={menuDragger.dragEnd} 
                            onDragstart={e => menuDragger.dragStart(e, component)} class="visual-editor-menu-item"
                        >
                            <span class="visual-editor-menu-item-label">{component.label}</span>
                            {component.preview()}
                        </div>
                    ))}
                </div>
                <div class="visual-editor-head">
                    head
                </div>
                <div class="visual-editor-operator">
                    operator
                </div>
                <div class="visual-editor-body">
                    <div class="visual-editor-content">
                      <div class="visual-editor-container" ref={containerRef} style={containerStyles.value}>
                          {!!dataModel.value.blocks && (
                              dataModel.value.blocks.map((block, index) => (
                                <VisualEditorBlock config={props.config} block={block} key={index} />
                              ))
                          )}
                      </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default VisualEditor;