export interface Listener {
    name: string;
    element: Element;
    callback: (value: any) => any;
    useCapture: boolean;
    type: 'dom' | 'output';
}
