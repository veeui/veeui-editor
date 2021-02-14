import { VisualEditorComponent } from './index.d'

export const createVisualConfig = () => {
    const componentList: VisualEditorComponent[] = [];
    const componentMap: Record<string, VisualEditorComponent> = {};
    return {
        componentList,
        componentMap,
        registry: (key:string, component: Omit<VisualEditorComponent, 'name'>) => {
            let comp = {...component, key};
            componentList.push(comp);
            componentMap[key] = comp;
        }
    }
}

export type VisualConfig = ReturnType<typeof createVisualConfig>