import { computed, defineComponent, PropType, ref } from 'vue';
import { VisualEditorBlockData, VisualEditorComponent, VisualEditorModelValue } from '@/components/index.d.ts';
import { VisualConfig, createVisualBlock } from '@/components/index.utils';
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

        const focusData = computed(() => {
            const focus: VisualEditorBlockData[] = [],
                  unFocus: VisualEditorBlockData[] = [];
            
            (dataModel.value.blocks || []).forEach(block => (block.focus ? focus : unFocus).push(block));

            return {
                focus,
                unFocus
            }
        })

        // 方法
        const methods = {
            clearFocus: ( block ?: VisualEditorBlockData ) => {
                let blocks = dataModel.value.blocks || [];

                if(blocks.length === 0) return;

                if(!!block) blocks = blocks.filter(item => item !== block)

                blocks.forEach(block => block.focus = false)
            }
        }

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
                blocks.push(createVisualBlock({
                    component: menuDragger.current.component!,
                    top: e.offsetY,
                    left: e.offsetX
                }));
                dataModel.value = {...dataModel.value, blocks}
            }
        };

        const containerFocus = {
            mouseDown: (e: MouseEvent) => {
                console.log('container mousedown')
                e.stopPropagation();
                e.preventDefault();
                methods.clearFocus()
            }
        };

        const blockFocus = {
            mouseDown: (e: MouseEvent, block: VisualEditorBlockData) => {
                e.stopPropagation();
                e.preventDefault();
                if(e.shiftKey) {
                    block.focus = !block.focus;
                } else {
                    if(!block.focus) {
                        block.focus = true;
                        methods.clearFocus(block)
                    }
                }
                blockDragger.mouseDown(e)
            }
        };

        const blockDragger = {
            dragState: {
                startX: 0,
                startY: 0,
                startPos: [] as { left: number, top: number }[]
            },
            mouseDown: (e: MouseEvent) => {
                blockDragger.dragState.startX = e.clientX;
                blockDragger.dragState.startY = e.clientY;
                blockDragger.dragState.startPos = focusData.value.focus.map(({top, left}) => ({top, left}))
                document.addEventListener('mousemove', blockDragger.mouseMove);
                document.addEventListener('mouseup', blockDragger.mouseUp);
            },
            mouseMove: (e: MouseEvent) => {
                const durX = e.clientX - blockDragger.dragState.startX,
                      durY = e.clientY - blockDragger.dragState.startY;
                focusData.value.focus.forEach((block, index) => {
                    block.top = blockDragger.dragState.startPos[index].top + durY;
                    block.left = blockDragger.dragState.startPos[index].left + durX;
                })
            },
            mouseUp: (e: MouseEvent) => {
                document.removeEventListener('mousemove', blockDragger.mouseMove);
                document.removeEventListener('mouseup', blockDragger.mouseUp);
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
                      <div 
                        class="visual-editor-container" 
                        ref={containerRef} 
                        style={containerStyles.value}
                        onMousedown={containerFocus.mouseDown}
                      >
                          {!!dataModel.value.blocks && (
                              dataModel.value.blocks.map((block, index) => (
                                <VisualEditorBlock 
                                    config={props.config} 
                                    block={block} 
                                    key={index}
                                    {...{
                                        onMouseDown: (e: MouseEvent) => blockFocus.mouseDown(e, block)
                                    }} 
                                />
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