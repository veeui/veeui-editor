export interface VisualEditorBlockData {
    top: number,
    left: number,
    componentKey: string
}

export interface VisualEditorModelValue {
    container: {
        width: number,
        height: number
    },
    blocks: VisualEditorBlockData[]
}

export interface VisualEditorComponent {
    key: string,
    label: string,
    preview: () => JSX.Element,
    render: () => JSX.Element
}